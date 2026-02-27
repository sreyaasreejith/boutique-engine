import { useEffect, useState } from "react";
import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import ConfirmModal from "../components/ConfirmModal";

function MenuAdmin() {

const [categories,setCategories] = useState([]);
const [name,setName] = useState("");
const [modalState, setModalState] = useState({
  isOpen: false,
  type: "",
  message: "",
  categoryId: null,
  categoryName: null
});


// =====================
// LOAD CATEGORIES
// =====================
const fetchCategories = async ()=>{

const snap =
await getDocs(collection(db,"categories"));

const data = snap.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

data.sort((a,b)=>
(a.order||0)-(b.order||0)
);

setCategories(data);

};

useEffect(()=>{
fetchCategories();
},[]);


// =====================
// ADD CATEGORY
// =====================
const addCategory = async ()=>{

if(!name.trim()) return;

await addDoc(
collection(db,"categories"),
{
name:name,
order:Date.now()
}
);

setName("");
fetchCategories();

};


// =====================
// DELETE CATEGORY SAFE
// =====================
const deleteCategory = async(id,name)=>{

setModalState({
isOpen: true,
type: "delete",
message: `Delete "${name}" category? Any products in this category will be orphaned.`,
categoryId: id,
categoryName: name
});

};

const confirmDeleteCategory = async () => {
  // check products
  const products =
    await getDocs(collection(db,"products"));

  let used=false;

  products.forEach(p=>{
    if(
      p.data().category === modalState.categoryName
    ){
      used=true;
    }
  });

  if(used){
    setModalState({
      isOpen: true,
      type: "error",
      message: "Cannot delete. Products exist in this category."
    });
    return;
  }

  await deleteDoc(
    doc(db,"categories", modalState.categoryId)
  );

  fetchCategories();
  setModalState({ ...modalState, isOpen: false });
};

// =====================
// REORDER CATEGORIES
// =====================
const reorderCategory = async(categoryId, direction)=>{
  const currentIndex = categories.findIndex(c=>c.id===categoryId);
  
  if(direction === "up" && currentIndex > 0){
    const currentCat = categories[currentIndex];
    const prevCat = categories[currentIndex-1];
    
    const tempOrder = currentCat.order;
    
    await updateDoc(
      doc(db,"categories",currentCat.id),
      {order: prevCat.order - 1}
    );
    
    await updateDoc(
      doc(db,"categories",prevCat.id),
      {order: tempOrder}
    );
  }
  else if(direction === "down" && currentIndex < categories.length-1){
    const currentCat = categories[currentIndex];
    const nextCat = categories[currentIndex+1];
    
    const tempOrder = currentCat.order;
    
    await updateDoc(
      doc(db,"categories",currentCat.id),
      {order: nextCat.order + 1}
    );
    
    await updateDoc(
      doc(db,"categories",nextCat.id),
      {order: tempOrder}
    );
  }
  
  fetchCategories();
};

// =====================
// SET PRIMARY CATEGORY
// =====================
const setPrimaryCategory = async(categoryId)=>{
  const minOrder = Math.min(...categories.map(c=>c.order||0));
  
  await updateDoc(
    doc(db,"categories",categoryId),
    {order: minOrder - 1000}
  );
  
  fetchCategories();
};



return(

<div>

<h2>Categories</h2>

<div className="admin-form">

<input
placeholder="Category name"
value={name}
onChange={(e)=>
setName(e.target.value)
}
/>

<div className="form-actions">
<button onClick={addCategory}>
Add Category
</button>

<button
className="cancel-btn"
onClick={() => setName("")}
>
Cancel
</button>
</div>

</div>


<div className="admin-list">

{categories.map((cat, idx)=>(

<div
key={cat.id}
className="admin-card"
>

<h4>{cat.name}</h4>

{categories[0]?.id === cat.id && (
  <span style={{
    display: "inline-block",
    backgroundColor: "#6366f1",
    color: "white",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "12px"
  }}>
    Primary
  </span>
)}

<div className="card-actions">
  <button
    className="order-btn"
    onClick={()=>reorderCategory(cat.id,"up")}
    disabled={idx === 0}
    title="Move up"
  >
    ↑
  </button>
  
  <button
    className="order-btn"
    onClick={()=>reorderCategory(cat.id,"down")}
    disabled={idx === categories.length-1}
    title="Move down"
  >
    ↓
  </button>
  
  <button
    className="primary-btn"
    onClick={()=>setPrimaryCategory(cat.id)}
    disabled={categories[0]?.id === cat.id}
    title="Set as primary"
  >
    Primary
  </button>

  <button
    className="delete-btn"
    onClick={()=>
      deleteCategory(
        cat.id,
        cat.name
      )
    }
  >
    Delete
  </button>
</div>

</div>

))}

</div>

{/* MODALS */}
<ConfirmModal
  isOpen={modalState.isOpen && modalState.type === "delete"}
  title="Delete Category"
  message={modalState.message}
  confirmText="Delete"
  cancelText="Cancel"
  isDanger={true}
  onConfirm={confirmDeleteCategory}
  onCancel={() => setModalState({ ...modalState, isOpen: false })}
/>

<ConfirmModal
  isOpen={modalState.isOpen && modalState.type === "error"}
  title="Cannot Delete"
  message={modalState.message}
  confirmText="OK"
  cancelText=""
  isDanger={true}
  onConfirm={() => setModalState({ ...modalState, isOpen: false })}
  onCancel={() => setModalState({ ...modalState, isOpen: false })}
/>

</div>

);

}

export default MenuAdmin;