import React, { useState } from "react";
import Posts from "@components/Lists/Posts/Posts";
import MessageBox from "@common/MessageBox/MessageBox";

const Home = ({ fanpageId, role }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [newPost, setNewPost] = useState({
    content: "",
    file: null,
    setContent: () => {},
    setFile: () => {},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setNewPost({ content, file, setContent, setFile });
  };
  return (
    <div className="fanpage-home">
      <form onSubmit={handleSubmit}>
        {role === "admin" && (
          <MessageBox
            btnSize="small"
            value={content}
            onChange={setContent}
            file={file}
            setFile={setFile}
          />
        )}
      </form>
      {fanpageId && <Posts fanpageId={fanpageId} newPost={newPost} />}
    </div>
  );
};

export default Home;
