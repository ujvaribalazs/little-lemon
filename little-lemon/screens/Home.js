// Home.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { memo } from "react";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../components/AuthContext";

const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("little_lemon.db");
  await db.execAsync("PRAGMA journal_mode = WAL");
  return db;
};

const Home = () => {
  const { loginState } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [db, setDb] = useState(null);

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

  const storeDataInSQLite = async (db, menuData) => {
    if (!db) {
      console.error("Database not initialized.");
      return;
    }
    try {
      console.log("Storing data in SQLite...");
      await db.execAsync("DELETE FROM menu");
      for (const item of menuData) {
        console.log(`Storing item: ${item.name}`);
        await db.runAsync(
          "INSERT INTO menu (name, price, description, image) VALUES (?, ?, ?, ?)",
          [item.name, item.price, item.description, item.image]
        );
      }
    } catch (error) {
      console.error("Error storing data in SQLite:", error);
    }
  };

  const loadMenuFromSQLite = async (db) => {
    if (!db) {
      console.error("Database not initialized.");
      return;
    }
    try {
      console.log("Loading data from SQLite...");
      const result = await db.getAllAsync("SELECT * FROM menu");
      console.log("Loaded Menu Items from SQLite:", result);
      setMenuItems(result);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data from SQLite:", error);
    }
  };

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log("Initializing database...");
        const database = await openDatabase();
        setDb(database);

        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL,
            description TEXT,
            image TEXT
          );
        `);

        const result = await database.getFirstAsync(
          "SELECT count(*) as count FROM menu"
        );
        if (result.count === 0) {
          console.log("No data in database, fetching from API...");
          await fetchMenuData(database);
        } else {
          console.log("Data found in database, loading...");
          await loadMenuFromSQLite(database);
        }
      } catch (error) {
        console.error("Error initializing database:", error);
        setLoading(false); // Ensure loading state is updated in case of error
      }
    };

    initializeDatabase();
  }, [loginState]);

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
});

export default Home;
