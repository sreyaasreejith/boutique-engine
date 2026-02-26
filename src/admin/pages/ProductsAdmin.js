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
import { uploadImage } from "../utils/uploadImage";
import ConfirmModal from "../components/ConfirmModal";

export default function ProductsAdmin(){

const [products,setProducts]=useState([]);
const [categories,setCategories]=useState([]);

const [loading,setLoading]=useState(true);

const [uploading,setUploading]=useState(false);
const [progress,setProgress]=useState(0);

const [editId,setEditId]=useState(null);

const [modalState, setModalState] = useState({
  isOpen: false,
  type: "",
  message: "",
  productId: null
});

const [toast, setToast] = useState({
  isVisible: false,
  message: "",
  type: "success"
});

const [form, setForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    category: "",
    image: "",
    images: []
  });


// =====================
// FETCH PRODUCTS
// =====================

const fetchProducts = async()=>{

setLoading(true);

const snap =
await getDocs(collection(db,"products"));

setProducts(
snap.docs.map(d=>({
id:d.id,
...d.data()
}))
);

setLoading(false);

};


// =====================
// FETCH CATEGORIES
// =====================

const fetchCategories = async()=>{

const snap =
await getDocs(collection(db,"categories"));

setCategories(
snap.docs.map(d=>d.data().name)
);

};


useEffect(()=>{

fetchProducts();
fetchCategories();

},[]);


// =====================
// IMAGE UPLOAD
// =====================

const handleUpload = async(e)=>{

const file = e.target.files[0];
if(!file) return;

setUploading(true);

const url =
await uploadImage(file,setProgress);

// Set as primary image
setForm(prev=>({
...prev,
image:url,
images: [...(prev.images || []), url]
}));

setUploading(false);

};

// =====================
// REMOVE IMAGE FROM GALLERY
// =====================

const removeImage = (indexToRemove) => {
  setForm(prev => {
    const newImages = prev.images.filter((_, index) => index !== indexToRemove);
    return {
      ...prev,
      images: newImages,
      image: indexToRemove === 0 && newImages.length > 0 ? newImages[0] : prev.image
    };
  });
};

// =====================
// SHOW TOAST NOTIFICATION
// =====================

const showToast = (message, type = "success") => {
  setToast({
    isVisible: true,
    message,
    type
  });
  
  setTimeout(() => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  }, 3000);
};

// =====================
// SET IMAGE AS PRIMARY
// =====================

const setAsPrimary = (indexToSet) => {
  setForm(prev => {
    const newImages = [...prev.images];
    const primaryImage = newImages[indexToSet];
    
    // Move selected image to the front
    newImages.splice(indexToSet, 1);
    newImages.unshift(primaryImage);
    
    showToast("Image set as primary ✓", "success");
    
    return {
      ...prev,
      images: newImages,
      image: primaryImage
    };
  });
};

// =====================
// HANDLE DRAG START
// =====================

const handleDragStart = (e, index) => {
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("fromIndex", index);
};

// =====================
// HANDLE DRAG OVER
// =====================

const handleDragOver = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
};

// =====================
// HANDLE DROP
// =====================

const handleDrop = (e, toIndex) => {
  e.preventDefault();
  const fromIndex = parseInt(e.dataTransfer.getData("fromIndex"));
  
  if (fromIndex === toIndex) return;
  
  setForm(prev => {
    const newImages = [...prev.images];
    const draggedImage = newImages[fromIndex];
    
    // Remove from old position
    newImages.splice(fromIndex, 1);
    // Insert at new position
    newImages.splice(toIndex, 0, draggedImage);
    
    return {
      ...prev,
      images: newImages,
      image: newImages[0] // Keep first as primary
    };
  });
};


// =====================
// ADD OR UPDATE
// =====================

const saveProduct = async()=>{

if(!form.name || !form.price || !form.image){

setModalState({
isOpen: true,
type: "error",
message: "Name, Price & Image are required."
});
return;

}

const cleanedForm = {
...form,
discountPrice: form.discountPrice || ""
};

// UPDATE
if(editId){

await updateDoc(
doc(db,"products",editId),
cleanedForm
);

setModalState({
isOpen: true,
type: "success",
message: "Product Updated Successfully ✅"
});

setEditId(null);

}else{

await addDoc(
collection(db,"products"),
cleanedForm
);

setModalState({
isOpen: true,
type: "success",
message: "Product Added Successfully ✅"
});

}

setForm({
name:"",
price:"",
discountPrice:"",
category:"",
image:"",
images:[]
});

fetchProducts();

};


// =====================
// EDIT
// =====================

const editProduct=(product)=>{

setEditId(product.id);

setForm({

name:product.name,
price:product.price,
discountPrice:product.discountPrice || "",
category:product.category,
image:product.image,
images: product.images || (product.image ? [product.image] : [])

});

window.scrollTo({
top:0,
behavior:"smooth"
});

};


// =====================
// DELETE
// =====================

const deleteProduct = async(id)=>{

setModalState({
isOpen: true,
type: "delete",
message: "Are you sure you want to delete this product? This action cannot be undone.",
productId: id
});

};

const confirmDelete = async () => {
  await deleteDoc(doc(db,"products", modalState.productId));
  fetchProducts();
  setModalState({ ...modalState, isOpen: false });
};


// =====================
// UI
// =====================

return(

<div>

{toast.isVisible && (
  <div className={`toast toast-${toast.type}`}>
    {toast.message}
  </div>
)}

<h2>Products</h2>

<div className="admin-form">

<input
placeholder="Product Name"
value={form.name}
onChange={e=>
setForm({...form,name:e.target.value})
}
/>

<input
type="number"
step="0.01"
min="0"
placeholder="Price"
value={form.price}
onChange={e=>
setForm({...form,price:e.target.value})
}
/>

<input
type="number"
step="0.01"
min="0"
placeholder="Discount Price (Optional)"
value={form.discountPrice}
onChange={e=>
setForm({...form,discountPrice:e.target.value})
}
/>


{/* CATEGORY DROPDOWN */}

<select
value={form.category}
onChange={e=>
setForm({...form,category:e.target.value})
}
>

<option value="">
Select Category
</option>

{categories.map(cat=>(
<option key={cat}>
{cat}
</option>
))}

</select>



{/* IMAGE */}

<label className="upload-btn">

{uploading
?`Uploading ${progress}%`
:"Upload Image"}

<input
type="file"
accept="image/*"
hidden
onChange={handleUpload}
/>

</label> 


{form.image &&(

<div className="image-preview-section">
  <h4>Primary Image</h4>
  <img
    src={form.image}
    className="preview"
    alt="primary"
  />
</div>

)}

{/* Image Gallery Preview */}
{form.images.length > 0 && (
  <div className="image-gallery-preview">
    <h4>Uploaded Images ({form.images.length}) - Drag to reorder</h4>
    <div className="gallery-grid">
      {form.images.map((imgUrl, index) => (
        <div 
          key={index} 
          className="gallery-item"
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          <img src={imgUrl} alt={`Product ${index + 1}`} />
          
          <div className="gallery-actions">
            <button
              type="button"
              className="set-primary-btn"
              onClick={() => setAsPrimary(index)}
              title={index === 0 ? "Already primary" : "Set as primary image"}
              disabled={index === 0}
            >
              ★
            </button>
            
            <button
              type="button"
              className="remove-img-btn"
              onClick={() => removeImage(index)}
              title="Remove image"
            >
              ✕
            </button>
          </div>
          
          {index === 0 && <span className="primary-badge">Primary</span>}
        </div>
      ))}
    </div>
  </div>
)}



{/* BUTTON */}

<div className="form-actions">

<button
className="save-btn"
onClick={saveProduct}
>

{editId
? "Update Product"
: "Add Product"}

</button>

<button
className="cancel-btn"
onClick={()=>{

setEditId(null);

setForm({
name:"",
price:"",
discountPrice:"",
category:"",
image:"",
images:[]
});

}}
>
Clear Form
</button>

</div>

</div>



{/* PRODUCTS */}

{loading?

<div className="skeleton-grid">

{[1,2,3,4].map(i=>(
<div
key={i}
className="skeleton-card"
/>
))}

</div>

:

<div className="admin-list">

{products.map(p=>(

<div
key={p.id}
className="admin-card"
>

<img src={p.image} alt=""/>

<h4>{p.name}</h4>

<p>{p.category}</p>

<div className="admin-pricing">
{p.discountPrice ? (
<>
<p className="discount-price">₹ {p.discountPrice}</p>
<p className="original-price">₹ {p.price}</p>
<span className="discount-percent">-{Math.round(((p.price - p.discountPrice) / p.price) * 100)}%</span>
</>
) : (
<p>₹ {p.price}</p>
)}
</div>

<div className="card-actions">

<button
className="edit"
onClick={()=>
editProduct(p)
}
>
Edit
</button>

<button
className="delete"
onClick={()=>
deleteProduct(p.id)
}
>
Delete
</button>

</div>

</div>

))}

</div>

}

{/* CONFIRM MODALS */}
<ConfirmModal
  isOpen={modalState.isOpen && modalState.type === "error"}
  title="Error"
  message={modalState.message}
  confirmText="OK"
  cancelText=""
  isDanger={true}
  onConfirm={() => setModalState({ ...modalState, isOpen: false })}
  onCancel={() => setModalState({ ...modalState, isOpen: false })}
/>

<ConfirmModal
  isOpen={modalState.isOpen && modalState.type === "success"}
  title="Success"
  message={modalState.message}
  confirmText="OK"
  cancelText=""
  isDanger={false}
  onConfirm={() => setModalState({ ...modalState, isOpen: false })}
  onCancel={() => setModalState({ ...modalState, isOpen: false })}
/>

<ConfirmModal
  isOpen={modalState.isOpen && modalState.type === "delete"}
  title="Delete Product"
  message={modalState.message}
  confirmText="Delete"
  cancelText="Cancel"
  isDanger={true}
  onConfirm={confirmDelete}
  onCancel={() => setModalState({ ...modalState, isOpen: false })}
/>

</div>

);

}