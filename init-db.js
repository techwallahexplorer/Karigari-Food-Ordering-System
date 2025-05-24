const admin = require('firebase-admin');

// Initialize Firebase Admin with service account
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://foodorder-8a5e6-default-rtdb.firebaseio.com'
});

const db = admin.database();

// Sample menu data
const menuData = {
  categories: {
    starters: {
      items: {
        1: {
          name: "Spring Rolls",
          price: 5.99,
          description: "Crispy vegetable spring rolls",
          image: "spring-rolls.jpg"
        },
        2: {
          name: "Chicken Wings",
          price: 8.99,
          description: "Spicy buffalo wings",
          image: "wings.jpg"
        }
      }
    },
    mainCourse: {
      items: {
        3: {
          name: "Butter Chicken",
          price: 14.99,
          description: "Creamy curry with tender chicken",
          image: "butter-chicken.jpg"
        },
        4: {
          name: "Vegetable Biryani",
          price: 12.99,
          description: "Fragrant rice with mixed vegetables",
          image: "veg-biryani.jpg"
        }
      }
    },
    desserts: {
      items: {
        5: {
          name: "Gulab Jamun",
          price: 4.99,
          description: "Sweet milk dumplings",
          image: "gulab-jamun.jpg"
        },
        6: {
          name: "Ice Cream",
          price: 3.99,
          description: "Vanilla ice cream with chocolate sauce",
          image: "ice-cream.jpg"
        }
      }
    }
  }
};

// Initialize the database with menu data
db.ref('menu').set(menuData)
  .then(() => {
    console.log('Database initialized successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
    process.exit(1);
  });
