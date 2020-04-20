// import React from "react";
// import { render, fireEvent } from "@testing-library/react";
// import Main from "../Main";
// import { toHaveClass } from "@testing-library/jest-dom/matchers";

// expect.extend({ toHaveClass });

// describe("does form data works correct", () => {
//   it("Search form", () => {
//     const onsubmit = jest.fn();
//     const { getByTestId } = render(<Main onSubmit={onsubmit} />);

//     const searchContent = "something";

//     fireEvent.change(getByTestId("search-input"), {
//       target: { value: searchContent },
//     });
//     fireEvent.click(getByTestId("search-button"));

//     expect(onsubmit).toBeCalledWith({
//       searchContent,
//     });
//     expect(onsubmit).toHaveBeenCalledTimes(1);
//   });
//   it("Post form", () => {
//     const onsubmit = jest.fn();

//     const { getByTestId, getByText } = render(<Main onSubmit={onsubmit} />);

//     const postContent = "something";

//     fireEvent.change(getByTestId("post-text-area"), {
//       target: { value: postContent },
//     });
//     fireEvent.click(getByText(/Opublikuj/i));

//     expect(onsubmit).toBeCalledWith({
//       postContent,
//     });
//     expect(onsubmit).toHaveBeenCalledTimes(1);
//   });
// });

// describe("do display window post and search engine shows", () => {
//   it("search", () => {
//     const { getByTestId } = render(<Main search={true} />);
//     expect(getByTestId("main-search")).not.toHaveClass("is-close");
//   });
//   it("post window", () => {
//     const { getByTestId } = render(<Main addingPost={true} />);
//     expect(getByTestId("main-add-post")).not.toHaveClass("is-close");
//   });
// });
