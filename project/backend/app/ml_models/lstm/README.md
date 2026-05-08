# LSTM Model for Player Performance Trend

This directory contains the scaffold for the LSTM model intended to predict player performance trends over time.

## Requirements

This module requires PyTorch. Since the main project does not yet depend on PyTorch, you must install it separately to run this code:

```bash
pip install torch
```

## Usage

This code is currently **EXPERIMENTAL** and **ISOLATED** from the main application. It is not imported by default.

To use:

```python
import torch
from app.ml_models.lstm.model import PlayerPerformanceLSTM

# Example: Input size 10 features, Hidden size 50, 2 Layers, Output 1 (Performance Score)
model = PlayerPerformanceLSTM(input_size=10, hidden_size=50, num_layers=2, output_size=1)

# Dummy Input: Batch of 5 players, Sequence of last 20 matches, 10 features each
dummy_input = torch.randn(5, 20, 10)
output = model(dummy_input)
print(output)
```
