import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Select, Button, Typography, Alert } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import axios from 'axios';
/* import "antd/dist/reset.css"; */

const { Option } = Select;
const { Title } = Typography;

const TOKEN_PRICE_URL = "https://interview.switcheo.com/prices.json";
const TOKEN_ICONS_BASE = "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

const App = () => {
  const [tokens, setTokens] = useState([]);
  const [prices, setPrices] = useState({});
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [amount, setAmount] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(TOKEN_PRICE_URL).then(response => {
      const tokenData = response.data;
      console.log(tokenData)
      setPrices(tokenData);
      setTokens(Object.keys(tokenData));
    }).catch(() => setError("Failed to load token prices."));
  }, []);

  useEffect(() => {
    if (fromToken && toToken && amount) {
      if (prices[fromToken] && prices[toToken]) {
        setConvertedAmount((amount * prices[fromToken]) / prices[toToken]);
      } else {
        setConvertedAmount(null);
      }
    }
  }, [fromToken, toToken, amount, prices]);

  const handleSwap = () => {
    if (!fromToken || !toToken || !amount) {
      setError("Please select both tokens and enter an amount.");
      return;
    }
    setError(null);
    setConvertedAmount((amount * prices[fromToken].price) / prices[toToken].price);
    console.log(convertedAmount)
    console.log(fromToken,toToken)
  };

  return (
    <Card style={{ width: 450, margin: '50px auto', padding: 20, textAlign: 'center' }}>
      <Title level={3}>Currency Swap</Title>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />}
      
      <Card style={{ marginBottom: 10, padding: 15 }}>
        <Select
          placeholder="Select Token"
          style={{ width: '100%', marginBottom: 10 }}
          onChange={setFromToken}
          value={fromToken}
        >
          {tokens.map(token => (
            <Option key={token} value={token}>
              {/* <img src={`${TOKEN_ICONS_BASE}${token}.svg`} alt={token} width={20} style={{ marginRight: 8 }} /> */}
              {prices[token].currency}
            </Option>
          ))}
        </Select>

        <InputNumber
          placeholder="Amount"
          style={{ width: '100%', height: 50, fontSize: 18 }}
          min={0.0001}
          value={amount}
          onChange={setAmount}
          onKeyDown={(event) => {
            if (
              event.key === "Backspace" ||
              event.key === "Delete" ||
              event.key === "ArrowLeft" ||
              event.key === "ArrowRight"
            ) {
              return;
            }
            if (!/[0-9.]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />
      </Card>
      
      <SwapOutlined style={{ fontSize: 24, marginBottom: 10 }} />
      
      <Card style={{ marginBottom: 10, padding: 15 }}>
        <Select
          placeholder="Select Token"
          style={{ width: '100%', marginBottom: 10 }}
          onChange={setToToken}
          value={toToken}
        >
          {tokens.map(token => (
            <Option key={token} value={token}>
              {/* <img src={`${TOKEN_ICONS_BASE}${token}.svg`} alt={token} width={20} style={{ marginRight: 8 }} /> */}
              {prices[token].currency}
            </Option>
          ))}
        </Select>
      
        <InputNumber
          placeholder="Converted Amount"
          style={{ width: '100%', height: 50, fontSize: 18 }}
          value={convertedAmount || 0}
          readOnly
        />
      </Card>

      <Button type="primary" block onClick={handleSwap}>
        Swap Now
      </Button>
    </Card>
  );
};

export default App;