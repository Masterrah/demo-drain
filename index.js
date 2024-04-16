const express = require("express");
const Moralis = require("moralis").default;
const cors = require("cors"); // Import the cors package


const app = express();
const port = 3000;

const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjJjNjk3NTc4LTA2MzktNGU3NS1iMTU0LWUwY2QxYzZhNjk5MyIsIm9yZ0lkIjoiMjE5MzM0IiwidXNlcklkIjoiMjE5MDQ4IiwidHlwZUlkIjoiYjQ5MDQ3YzctMGNkYS00YjVjLTk5M2YtYjMzYjYyZDU3YmYzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODYwNDc2NzEsImV4cCI6NDg0MTgwNzY3MX0.ZPGUXbOVR8jY8p9-mA4vJXa-n4mJokCeDZ7LN5WJ3_E";

// Use cors middleware to enable CORS for all origins
app.use(cors());

async function getDemoData(address, chain) {
    try {
      // Get token balances
      const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain,
      });

      const walletdata = await Moralis.EvmApi.transaction.getWalletTransactions({
        address,
        chain,
      });

  
      // Format the balances to a readable output with the .display() method
      const tokenx = tokenBalances.toJSON();

      // Format the balances to a readable output with the .display() method
      const walletx = walletdata.toJSON();
  
      // Filter out tokens with possible_spam: false (keep tokens with possible_spam: false)
      const tokens = tokenx.filter((token) => token.possible_spam !== true);

  
      return { tokens, walletx};
    } catch (error) {
      console.error("Error fetching token balances:", error);
      throw error;
    }
  }
  

app.get("/", (req, res) => {
    res.send("Welcome to My Moralis Server!");
  });
  

app.get("/demo", async (req, res) => {
    try {
      // Extract the address and chain from the query parameters
      const { address, chain } = req.query;
  
      // Check if address and chain are provided
      if (!address || !chain) {
        res.status(400).json({ error: "Address and chain parameters are required." });
        return;
      }
  
      // Get and return the crypto data
      const data = await getDemoData(address, chain);
      res.status(200).json(data);
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });


const startServer = async () => {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
  });

  app.listen(port,() => console.log(`app listening on port http://localhost:${port}` ));
};

startServer();


