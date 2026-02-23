import { BRAND } from "../../config/brand";

function VisitSection() {

  const embedMap = `${BRAND.mapLink}&output=embed`;

  return (
    <section className="visit-section" id="contact">
      <div className="container visit-grid">

        <div className="visit-text">
          <h2>Visit Our Studio</h2>
          <p>{BRAND.address}</p>
          <p>{BRAND.email}</p>

          <div className="visit-actions">

            {/* Call Button */}
            <a
              href={`tel:+${BRAND.phone}`}
              className="visit-icon visit-call"
            >
              📞
            </a>

            {/* Instagram Button - Only if enabled */}
            {BRAND.instagram?.enabled && (
              <a
                href={BRAND.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="visit-icon visit-instagram"
              >
                📸
              </a>
            )}

          </div>
        </div>

        {/* Clickable Map Preview */}
        <a
          href={BRAND.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="visit-map"
        >
          <iframe
            title="map"
            src={embedMap}
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </a>

      </div>
    </section>
  );
}

export default VisitSection;