import { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase/firebase";
import ConfirmModal from "../components/ConfirmModal";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

function TestimonialsAdmin() {

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    text: ""
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    message: "",
    testimonialId: null
  });

  // --------------------
  // FETCH
  // --------------------
  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const testimonialsRef = collection(db, "testimonials");
      const snapshot = await getDocs(testimonialsRef);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // --------------------
  // ADD
  // --------------------
  const addTestimonial = async () => {
    if (!form.name.trim() || !form.text.trim()) {
      setModalState({
        isOpen: true,
        type: "error",
        message: "Please fill in all fields"
      });
      return;
    }

    await addDoc(collection(db, "testimonials"), form);
    setForm({ name: "", text: "" });
    fetchTestimonials();
    setModalState({
      isOpen: true,
      type: "success",
      message: "Testimonial added successfully!"
    });
  };

  // --------------------
  // DELETE
  // --------------------
  const deleteTestimonial = (id) => {
    setModalState({
      isOpen: true,
      type: "delete",
      message: "Are you sure you want to delete this testimonial? This action cannot be undone.",
      testimonialId: id
    });
  };

  const confirmDelete = async () => {
    await deleteDoc(doc(db, "testimonials", modalState.testimonialId));
    fetchTestimonials();
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <div>
      <h2>Testimonials</h2>

      <div className="admin-form">
        <input
          placeholder="Client Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          placeholder="Client Review"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
        />

        <div className="form-actions">
          <button onClick={addTestimonial}>
            Add Testimonial
          </button>

          <button
            className="cancel-btn"
            onClick={() => setForm({ name: "", text: "" })}
          >
            Cancel
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-list">
          {testimonials.map((item) => (
            <div key={item.id} className="admin-card">
              <p>{item.text}</p>
              <strong>— {item.name}</strong>
              <div className="card-actions">
                <button className="delete-btn" onClick={() => deleteTestimonial(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRM MODALS */}
      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === "error"}
        title="Error"
        message={modalState.message}
        confirmText="OK"
        cancelText=""
        isDanger={true}
        onConfirm={() => setModalState({ ...modalState, isOpen: false })}
      />

      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === "success"}
        title="Success"
        message={modalState.message}
        confirmText="OK"
        cancelText=""
        isDanger={false}
        onConfirm={() => setModalState({ ...modalState, isOpen: false })}
      />

      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === "delete"}
        title="Delete Testimonial"
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

export default TestimonialsAdmin;