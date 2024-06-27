import Header from "./Header.jsx";

export default function Container({ child }) {
  return (
    <>
      <Header />
      {child}
    </>
  );
}
