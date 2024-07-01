import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";

const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("little_lemon.db");
  return db;
};

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [db, setDb] = useState(null);

  const fetchMenuData = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
      );
      const data = await response.json();
      const menuData = data.menu;
      setMenuItems(menuData);
      await storeDataInSQLite(menuData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const storeDataInSQLite = async (menuData) => {
    try {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS menu (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price REAL,
          description TEXT,
          image TEXT
        );
        DELETE FROM menu;
      `);
      for (const item of menuData) {
        await db.runAsync(
          "INSERT INTO menu (name, price, description, image) VALUES (?, ?, ?, ?)",
          [item.name, item.price, item.description, item.image]
        );
      }
    } catch (error) {
      console.error("Error storing data in SQLite:", error);
    }
  };

  const loadMenuFromSQLite = async () => {
    try {
      const result = await db.getAllAsync("SELECT * FROM menu");
      setMenuItems(result);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data from SQLite:", error);
    }
  };

  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await openDatabase();
      setDb(database);

      // Ensure table is created before querying it
      try {
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
          await fetchMenuData();
        } else {
          await loadMenuFromSQLite();
        }
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    initializeDatabase();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Image
        style={styles.menuItemImage}
        source={{
          uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
        }}
      />
      <View style={styles.menuItemDetails}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#495E57" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Little Lemon</Text>
        <Image
          style={styles.headerImage}
          source={require("../assets/nurse2.jpg")}
        />
      </View>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

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
  headerText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  menuItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
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
