const CategoryCard = ({ category, onSelect, isSelected }) => {
  return (
    <div 
      className={`category-card-client ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(category.id)}
    >
      <div className="category-image-client">
        <img 
          src={category.image_url || '/placeholder.jpg'} 
          alt={category.name}
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
      </div>
      <div className="category-name-client">
        <h3>{category.name}</h3>
        {category.description && (
          <p className="category-description">{category.description}</p>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;