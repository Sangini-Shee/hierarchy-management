import { useEffect, useState } from "react";
import API from "../services/api";

function HierarchyView({ parentId }) {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    const fetchChildren = async () => {
      const id = parentId === null ? "null" : parentId;
      const res = await API.get(`/people/children/${id}`);
      setChildren(res.data);
    };
    fetchChildren();
  }, [parentId]);

  return (
    <div style={{ marginLeft: "20px" }}>
      {children.map(child => (
        <div key={child._id}>
          <h3>{child.name} ({child.role})</h3>
        </div>
      ))}
    </div>
  );
}

export default HierarchyView;