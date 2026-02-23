import { MENU_ITEMS } from "../../data/menu";

function EditorialMenu({ close, onCategorySelect }) {

  const handleClick = (item) => {

    // If Collections → reset filter
    if (item.id === "collections") {
      onCategorySelect(null);
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth"
      });
    }

    // If Category → filter
    else if (item.type === "category") {
      onCategorySelect(item.label);
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth"
      });
    }

    // Other sections → just scroll
    else {
      document.getElementById(item.id)?.scrollIntoView({
        behavior: "smooth"
      });
    }

    close();
  };

  return (
    <>
      <div className="menu-overlay" onClick={close}></div>

      <div className="side-menu">
        <button className="menu-close" onClick={close}>×</button>

        <ul>
          {MENU_ITEMS.map((item) => (
            <li key={item.id} onClick={() => handleClick(item)}>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default EditorialMenu;