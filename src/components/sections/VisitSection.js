import testimonials from "../../data/testimonials";

function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="section-title">Client Love</h2>

        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <div className="testimonial-card" key={item.id}>
              <p>“{item.text}”</p>
              <h4>— {item.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;