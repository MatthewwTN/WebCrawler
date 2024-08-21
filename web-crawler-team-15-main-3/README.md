[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/vObvlpWW)
# Web Crawler
A web crawler application that creates a web-link graphs and finds the Closeness Centrality for each node

Read the PowerPoint.
*You may use the Graph Library Shortest Paths functions*
*You **may not** use the Graph Library Closeness Centrality functions*

**DO NOT COPY, DO THE PROJECT 100% YOURSEVES**

## Introduction	

This project is a simple web crawler built with Node.js and Selenium. It reads URLs from a file and crawls each URL to a specified depth, building a graph of nodes and edges representing the links between pages. This is the term project for CSC 3430 (Algorithms Design and Analysis)

## Description

The main function of the web crawler is crawler(filePath, maxDepth).
filePath is the path to a text file containing the URLs to be crawled. Each URL should be on a separate line. This .txt file is passed through an API and Node JS Library Multer.
maxDepth is the maximum depth to which the crawler should follow links. A depth of 0 means that only the initial level of URLs will be crawled, a depth of 1 means that the crawler will follow links from the initial URLs to other pages, and so on.
The crawler will output a graph of nodes and edges. Each node represents a URL, and each edge represents a link from one URL to another.

On the front end, the user of this application will be able to place in the depth they want the graph to go to, as well as the set of url's in the .txt file that the user would like to scrape at the specified depth.

## Requirements	
1. Desktop, or Laptop Device
2. Node Version 18.0.0 -> This will be needed for the packages that the web-crawler uses, Node Version 18.0.0 is needed for some to run properly.
3. Terminal / Visual Studio Code Editor Terminal
   
## User Manual
To Run the project, download the source folder from the repository, and place it in any given directory of your choosing. Navigate to the directory where the source folder is, and cd into the source code folder.

> [!IMPORTANT]
> There are two parts to set up, the front and backend. The instructions for both can be found below. For these to work, you need Node.js Version 18.0.0 installed on your computer.
> Versions can be managed via - NVM (Node Version Manager) which can be installed with NPM (Node Package Manager). Update accordingly, documentation on this can be found below:
> 1. https://docs.npmjs.com/downloading-and-installing-node-js-and-npm (For Installing Node)
> 2. https://www.freecodecamp.org/news/how-to-update-node-and-npm-to-the-latest-version/ (For updating node version)

Backend Instructions Listed in Order: 

1. cd backend
2. npm ci -> Installs all the libraries being used
3. nodemon index -> runs the backend

Frontend Instructions/Commands Listed in Order: 

1. cd frontend
2. npm ci -> Installs all the libraries being used
3. npm run build
4. npm run dev -> which runs the development server open up a browser in your preferred search engine browser with the localhost url displayed from the command - as shown in the video.
5. When both stacks are working, you can enter in your .txt file with the URLs you want to parse, as well as the max/min depth you would like to crawl. Click the submit button after. 

> [!IMPORTANT]
> Note this step can take a long time depending on the depth you choose - be mindful of this as Javascript is not multi threaded which can lead to longer compile times.


## Reflection
>  
The Web Crawler, on its surface, seems like a simple concept to implement. But there are very challenging pieces that add complexity to the overall architecture and workings of the app. To begin, the integrated environment of developing a front-to-back-end application poses the first challenge. Followed by building the parser in an efficient manner, where it can scrape to depths that are more than 2 or 3, in a reasonable amount of time. We changed our parser from a library called Selenium to simply using Cheerio and Axios to parse the HTML from each webpage. This significantly reduced the amount of time it took to parse pages and made our graph outputs much faster.
The biggest challenge of this entire project was finding the most central node. Our goal was to find the most central node for each link passed into the .txt file, and from there, choose the link from the entire forest of graphs that had the highest centrality value. We iterated many times with multiple different algorithms to try and find a way to calculate the most central nodes. It led us to this formula found on network.org, which explained that we can find the most central node by running Reverse Dijkstra's Algorithm on each vertex/node. To find the central node, we want to know the distances of all other nodes to that node. That will tell us how many nodes can reach our node, the more, the higher chance it is the center node of the Graph. 

The complexity of our Algorithm is O(N ^ 4) - In short, the values come from the following Analysis:

1.	O(Depth) or Linear Time: The amount crawled on each URL will go up to D times.
2.	O(Number of Nodes): Inside the Crawler, we loop through each node added, in some cases filtering, in some cases parsing the node depending on the Depth. This constitutes as an N or Linear Time Loop.
3.	O(Number of HREFs): For each node, we loop through the hrefs that are found in it, parsing, creating new edges, and nodes.
4.	These 3 are nested within each other from top to bottom, leading to O(N^3) time complexity.
5.	Then, we run this for URL passed in the Text file, which can be another N links. An N^3 nested within a loop that runs N^3 leads to O(n^4).

For Closeness Centrality, we utilized normalized Closeness Centrality and Dijkstra’s Algorithm in Reverse. We reverse the graph, calculating the distance of all nodes to the source node. This runs in O(n^2) time in our implementation with Arrays. Once we find the total distance of all nodes to the source node, we place that value as the divisor of the total number of nodes it can reach. This gives us the calculation for closeness centrality. The reason we have to reverse the graph is to account for the fact that our graph is directed, so this small alteration is required for the most important page to be found.

We found that this was by far one of the most challenging projects to work on, due to the natural environment of work life balance and the finals week. Getting this project to be functional was not easy, we spent a lot of time even till the last minute trying to fine tune our algorithm, and what we got was pretty good overall. We would’ve liked to have a bit more time working on the crawler in order to improve our time complexity.

## Results

![](Screenshot%201.png)
![](Screenshot%202.png)
![](Screenshot%203.png)

Video: 

https://youtu.be/DKDv5Sy1d_8
