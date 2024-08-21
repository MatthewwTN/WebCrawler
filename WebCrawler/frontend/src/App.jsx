/* eslint-disable no-unused-vars */
import "./App.css";
import { useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import styled from "styled-components";
import { Spinner } from "./components/Spinner";

const Header = styled.div`
  font-size: 4rem;
  color: #000;
`;

const Window = styled.div`
  background-color: #eee;
  height: 100vh;
  width: 100vw;
  font-family: "Avenir";
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  font-size: 1.5rem;
  font-family: "Avenir";
`;

const FileInput = styled.input`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  font-size: 1.5rem;
`;

const Button = styled.button`
  padding: 1rem 1.75rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  font-size: 1.5rem;
  cursor: pointer;
  font-family: "Avenir";
  background-color: #000;
  color: #fff;
`;

const StyledParagraph = styled.p`
  font-size: 1.5rem;
  color: #000;

  &:hover {
    color: #777;
    transition: all 0.25s ease-in-out;
  }
`;

const StyledSmallParagraph = styled.p`
  font-size: 1rem;
  color: #000;

  &:hover {
    color: #777;
    transition: all 0.25s ease-in-out;
  }
`;

const LoadingWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

function App() {
  const [nodes, setNodes] = useState(null);
  const [links, setLinks] = useState(null);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleScrape = (e) => {
    e.preventDefault();

    setLoading(true);

    const depth = document.getElementById("depthInput").value;
    if (!file || depth === "" || depth === "0") {
      alert("Please upload a file, and specify a valid depth greater than 0.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch(`http://localhost:3000/crawl?depth=${depth}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("File uploaded successfully:", data);
        setNodes(data.nodes);
        setLinks(data.links);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setLoading(false);
      });
  };

  return (
    <Window>
      {loading ? (
        <LoadingWrapper>
          <Spinner />
          <StyledSmallParagraph>Loading...</StyledSmallParagraph>
          <StyledSmallParagraph>
            {" "}
            This may take some time - depths greater than 2 can take up to 30
            minutes and above to scrape.{" "}
          </StyledSmallParagraph>
        </LoadingWrapper>
      ) : nodes ? (
        <ForceGraph2D
          linkColor={"#FFF"} // Change the color here
          linkWidth={0.5}
          nodeRelSize={2}
          graphData={{
            nodes: nodes,
            links: links,
          }}
          nodeLabel={(node) => {
            return node.url;
          }}
          width={1500}
          height={1500}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.25}
        />
      ) : (
        <div>
          <Header>Web Scraper Visualizer</Header>
          <StyledSmallParagraph>
            {" "}
            Created by Matthew Negasi & Adalberto Acosta
          </StyledSmallParagraph>
          <StyledParagraph>
            Enter .txt file of URLs to start scraping - Please add a Depth as
            well!
          </StyledParagraph>
          <InputWrapper>
            <StyledInput id="depthInput" type="number" placeholder="Depth" />
            <StyledInput
              id="fileInput"
              type="file"
              placeholder="file input"
              accept=".txt" // Add the accept attribute to restrict file types
              onChange={(e) => {
                if (!e.target.files[0].name.endsWith(".txt")) {
                  alert("You can upload .txt files only.");
                  return false;
                } else {
                  console.log(e.target.files[0]);
                  setFile(e.target.files[0]);
                }
              }}
            />
            <Button onClick={handleScrape}>Scrape</Button>
          </InputWrapper>
        </div>
      )}
    </Window>
  );
}

export default App;
