import HierarchyView from "./components/HierarchyView";
import SearchBar from "./components/SearchBar";

function App() {
  return (
    <div>
      <h1>Hierarchy Management System</h1>
      <SearchBar />
      <HierarchyView parentId={null} />
    </div>
  );
}

export default App;