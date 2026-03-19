---

# Bunk-Tendence

**Bunk-Tendence** is a simple and practical attendance tracker that helps you understand how many classes you need to attend and how many you can safely miss while maintaining a target attendance percentage.

---

## Features

* Real-time attendance percentage calculation
* Custom target attendance percentage (e.g., 75%)
* Inputs:

  * Total classes conducted
  * Classes attended
* Calculates:

  * Minimum classes required to reach target
  * Maximum classes you can miss without dropping below target
  * Equivalent number of days (based on classes per day)
* Local storage support to persist data
* Instant updates with a reactive UI

---

## How It Works

Let:

* A = classes attended
* T = total classes
* P = target percentage

We solve:

```
(A + x) / (T + x) >= P
```

Where `x` is the number of future classes you must attend.

The app computes:

* Minimum classes to attend
* Maximum classes you can miss

---

## Tech Stack

* React / Next.js
* React Hooks (useState, useMemo, useEffect)
* localStorage for persistence
* Minimal UI design

---

## Installation

```bash
git clone https://github.com/constayush/bunk-tendence.git
cd bunk-tendence
npm install
npm run dev
```

---

## Usage

1. Enter:

   * Total classes conducted
   * Classes attended
   * Classes per day
   * Target attendance percentage

2. The app will display:

   * Current attendance
   * Classes and days required to reach target
   * Classes you can miss safely

---

## Example

| Metric        | Value |
| ------------- | ----- |
| Total Classes | 193   |
| Attended      | 101   |
| Target %      | 65%   |

Output:

* Required classes to attend: X
* Classes you can miss: Y
* Equivalent days: Z

---

## Assumptions

* Assumes a constant number of classes per day
* Does not account for:

  * Holidays
  * Extra classes
  * Different weights for lab/theory classes
* Treats all classes equally

This means results are approximate and may not match all institutional rules.

---

## Future Improvements

* Subject-wise tracking
* Calendar integration with holidays
* Attendance trend visualization
* Backend sync for persistence across devices
* Predictive suggestions (e.g., impact of future absences)

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT License
