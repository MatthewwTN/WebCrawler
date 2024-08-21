const fs = require("fs");
require("chromedriver");
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * crawler() - This function will take in a file path and a max depth to scrape through the website
 * It will return an object with the nodes and links array that will be passed to the frontend through the API which calls this function
 *
 * @param {*} filePath - the path to the .txt file containing the links to scrape within the backend directory (passed in through the multer library)
 * @param {*} maxDepth - the max depth to scrape on the websites passed in through the .txt file, each website will be scraped to this depth
 * @returns {Object} - an object containing the nodes and links array
 */
async function crawler(filePath, maxDepth) {
  let index = new Object();
  index.value = 0;
  let edges = [];
  let nodes = [];
  let urls = new Set();
  let confirmedLines = [];

  try {
    const data = fs.readFileSync(filePath, "utf8");
    let lines = data.split("\n");

    // Number of lines in the file
    for (let line of lines) {
      const link = line.trim(); // remove any leading/trailing whitespace
      confirmedLines.push(link);
      console.log(link);
      //console.log(link);
      if (link) {
        await populate(link, maxDepth, index, edges, nodes, urls, nodes.length);
      }
    }
  } catch (error) {
    console.error(`Error reading file: ${error}`);
  } finally {
    // await driver.quit();
  }


  //console.log(nodes);
  //console.log(edges);

  const scrapedNodes = nodes;
  const scrapedEdges = edges;

  // console.log("Nodes: " + scrapedNodes);

  return { nodes: scrapedNodes, links: scrapedEdges, graphs: confirmedLines}; //return the nodes and links after the loop
}

// O ( Depth * Number of Nodes * Number of HREFS ) * O (Number of .TXT Links)

/**
 *
 * populate() - This function will populate the nodes and edges array with the links from the .txt file
 * and the links from the website, it will also populate the urls set with the links from the websites
 *
 * @param {*} link - the current link from the .txt file to process and scrape
 * @param {*} maxDepth - the max depth to scrape on the website passed in
 * @param {*} index - An object keeping track of the index of the nodes array - passed by reference
 * @param {*} edges - the array of edges to be populated, passed by reference
 * @param {*} nodes - the array of nodes to be populated, passed by reference
 * @param {*} urls - the set of urls to be populated, passed by reference
 * @param {*} startIndex - the index to start from in the nodes array, when we return to the while loop in crawler function, we need to start from the last node we added
 * @returns void
 */
async function populate(link, maxDepth, index, edges, nodes, urls, startIndex) {

  let parentlink = link;

  if (!link) {
    console.error("No link provided");
    return;
  }

  nodes.push({ id: index.value, url: link, graph: parentlink }); // we push the original link
  urls.add(link);
  index.value++; // update the index

  // Depth
  while (0 < maxDepth) {
    let newNodes = []; // heres a newNode array, this will hold all the nodes from the children

    // We will loop through the nodes array, starting from the startIndex
    for (let i = startIndex; i < nodes.length; i++) {
      try {
        const { data } = await axios.get(nodes[i].url);
        // Load the HTML into cheerio
        const $ = cheerio.load(data);
        // Select all 'a' tags
        const aTags = $("a");
        //console.log(aTags.length);
        // Array to hold all hrefs
        let links = [];
        // Iterate over each 'a' tag
        aTags.each((index, aTag) => {
          // Get the href attribute
          const href = $(aTag).attr("href");
          // Add href to the array
          links.push(href);
        });

        // Filter the links O( Number of Links - NL )
        let filteredLinks = links.filter((link) => link && !link.includes("#"));
        // this is a filter method that removes duplicates, can be found with the # sign

        // We will loop through the filteredLinks array again (N time)
        filteredLinks.map((link) => {
          // If we find a new link, we will end up adding it to the newNodes array
          if (!urls.has(link)) {
            urls.add(link);
            newNodes.push({ id: index.value, url: link , graph: parentlink});
            edges.push({ source: i, target: index.value, graph: parentlink});
            index.value++;
          }
          // We still need to handle this edge case, if we find a link that is already in the array, we will just add the edge
          else {
            let targetIndex = nodes.findIndex((node) => node.url === link);
            if (targetIndex !== -1) {
              edges.push({ source: i, target: targetIndex, graph: parentlink});
            }
          }
        });
      } catch (error) {
        if (error instanceof AggregateError) {
         //If page is not loaded, we will just skip it
        }
      }
    }

    nodes.push(...newNodes);
    //console.log("Nodes: " + nodes);
    maxDepth--;
    if (maxDepth === 0) {
      break;
    }
  }
}





module.exports = crawler;


//Undirected CC for a directed graph V1


//Undirected CC for an undirected graph V2

//Directed CC for a directed graph V3