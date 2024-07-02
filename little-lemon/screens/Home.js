// Home.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { memo } from "react";
import * as SQLite from "expo-sqlite/legacy";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../components/AuthContext";

const openDatabase = () => {
  const db = SQLite.openDatabase("little_lemon.db");
  return db;
};

const Home = () => {
  const { loginState } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([
    "Desserts",
    "Drinks",
  ]);
  const navigation = useNavigation();
  const [db, setDb] = useState(null);

  const categories = ["starters", "mains", "desserts", "drinks", "specials"];

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
    console.log(
      "from toggleCategory, the selected category: ",
      selectedCategories
    );
  };

  const fetchMenuData = async (db) => {
    try {
      console.log("Fetching menu data...");
      const response = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
      );
      const data = await response.json();
      const menuData = data.menu;

      console.log("Menu Data Length:", menuData.length);
      console.log("Menu Data:", menuData);

      await storeDataInSQLite(db, menuData);
      setMenuItems(menuData);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  const storeDataInSQLite = (db, menuData) => {
    if (!db) {
      console.error("Database not initialized.");
      return;
    }
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM menu");
      menuData.forEach((item) => {
        tx.executeSql(
          "INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)",
          [item.name, item.price, item.description, item.image, item.category],
          (_, result) => {
            console.log(`Stored item: ${item.name}`);
          },
          (_, error) => {
            console.error("Error storing data in SQLite:", error);
            return false;
          }
        );
      });
    });
  };

  const loadMenuFromSQLite = (db) => {
    if (!db) {
      console.error("Database not initialized.");
      return;
    }
    db.transaction((tx) => {
      let query = "SELECT * FROM menu";
      const params = [];
      console.log("query1:", query);
      console.log(selectedCategories.length);
      console.log("selected category: ", selectedCategories);
      if (selectedCategories.length > 0) {
        const placeholders = selectedCategories.map(() => "?").join(",");
        console.log("placeholders", placeholders);
        query += ` WHERE category IN (${placeholders})`;
        params.push(...selectedCategories);
        console.log("params: ", params);
      }
      console.log("query2:", query);
      tx.executeSql(
        query,
        params,
        (_, { rows: { _array } }) => {
          if (_array.length) {
            console.log("Loaded Menu Items from SQLite:", _array);
            setMenuItems(_array);
          } else {
            console.log("No menu items found in SQLite.");
            setMenuItems([]);
          }
          setLoading(false);
        },
        (_, error) => {
          console.error("LMFSL: Error loading data from SQLite:", error);
          return false;
        }
      );
    });
  };

  const checkDatabaseContent = (db) => {
    if (!db) {
      console.error("Database not initialized.");
      return;
    }
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM menu",
        [],
        (_, { rows: { _array } }) => {
          if (_array.length) {
            console.log("Current Menu Items in SQLite:");
            _array.forEach((item) => {
              console.log(item);
            });
          } else {
            console.log("No menu items found in SQLite.");
          }
        },
        (_, error) => {
          console.error("Error checking database content:", error);
          return false;
        }
      );
    });
  };

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log("Initializing database...");
        const db = openDatabase();
        setDb(db);

        db.transaction((tx) => {
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS menu (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT,
              price REAL,
              description TEXT,
              image TEXT,
              category TEXT
            );
          `);
          tx.executeSql(
            "SELECT count(*) as count FROM menu",
            [],
            async (_, { rows: { _array } }) => {
              if (_array[0].count === 0) {
                console.log("No data in database, fetching from API...");
                await fetchMenuData(db);
              } else {
                console.log("Data found in database, loading...");
                loadMenuFromSQLite(db);
              }
              checkDatabaseContent(db); // Check database content after initialization
            }
          );
        });
      } catch (error) {
        console.error("Error initializing database:", error);
        setLoading(false); // Ensure loading state is updated in case of error
      }
    };

    initializeDatabase();
  }, [loginState]);

  useEffect(() => {
    if (db) {
      loadMenuFromSQLite(db);
      checkDatabaseContent(db); // Check database content after category selection
    }
  }, [selectedCategories]);

  const renderItem = ({ item }) => <MenuItem item={item} />;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#495E57" />
      </View>
    );
  }

  console.log("Rendering Menu Items Length:", menuItems.length);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Little Lemon</Text>
          <Text style={styles.headerLocation}>Chicago</Text>
          <Text style={styles.headerText}>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </Text>
        </View>
        <Image
          style={styles.headerImage}
          source={require("../assets/WelcomeHeader.jpg")}
        />
      </View>
      <View style={styles.categoryContainer}>
        <ScrollView horizontal style={styles.scrollView}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategories.includes(category) &&
                  styles.selectedCategory,
              ]}
              onPress={() => toggleCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategories.includes(category) &&
                    styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
      />
    </View>
  );
};

const MenuItem = memo(({ item }) => {
  const [imageSource, setImageSource] = useState({
    uri: `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/${item.image}?raw=true`,
  });

  const handleError = () => {
    console.error(`Failed to load image: ${item.image}`);
    setImageSource(
      item.image === "lemonDessert.jpg"
        ? require("../assets/lemonDessert.png")
        : item.image === "grilledFish.jpg"
        ? require("../assets/grilledFish.png")
        : require("../assets/defaultImage.jpg")
    );
  };

  return (
    <View style={styles.menuItem}>
      <View style={styles.menuItemDetails}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <Image
        style={styles.menuItemImage}
        source={imageSource}
        defaultSource={require("../assets/defaultImage.jpg")}
        onError={handleError}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#495E57",
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 40,
    color: "#F4CE14",
    fontWeight: "bold",
  },
  headerLocation: {
    fontSize: 30,
    color: "#ffffff",
  },
  headerText: {
    fontSize: 18,
    color: "#ffffff",
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  menuItemImage: {
    width: 70,
    height: 70,
    marginLeft: 10,
  },
  menuItemDetails: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menuItemDescription: {
    color: "#666",
  },
  menuItemPrice: {
    marginTop: 5,
    fontWeight: "bold",
  },
  scrollView: {
    marginVertical: 10,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: "#000",
  },
  categoryText: {
    color: "#000",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  categoryContainer: {
    height: 80, // Fix height for the category selector
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Home;
