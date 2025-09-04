//this file is for the hardcoded product information as well as the functions needed to filter products

//hard coded products below
const products = [
  { id: 1, name: "Golden Retriever Puppy", price: 800, special: false },
  { id: 2, name: "Persian Cat", price: 1500, special: true },
  { id: 3, name: "Hamster", price: 25, special: false },
  { id: 4, name: "Bengal Cat", price: 3000, special: true },
  { id: 5, name: "Beagle Puppy", price: 600, special: false },
  { id: 6, name: "African Grey Parrot", price: 2500, special: true },
  { id: 7, name: "Guinea Pig", price: 40, special: false },
  { id: 8, name: "Maine Coon Kitten", price: 2000, special: true }
];

//function to find product by ID
const getProductById = (id) => {
  return products.find((product) => 
    product.id === parseInt(id));
};

//function to return special products only
const getSpecialPlanPets = () => {
  return products.filter((pet) => 
    pet.special);
};

//function to return free plan pets only
const getFreePlanPets = () => {
  return products.filter((pet) => 
    !pet.special);
};

//basic searching function for metered features
const searchPets = (search) => {
    return products.filter((pet) => {
        pet.name.toLowerCase().includes(search.toLowerCase())
    })
}

export default {
  products,
  getProductById,
  getSpecialPlanPets,
  getFreePlanPets,
  searchPets
}