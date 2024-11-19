import { useReducer } from "react";
import "./styles.css";

// Initial state
const initialState = {
  currentOperand: "",
  previousOperand: "",
  operation: null,
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case "ADD_DIGIT":
      // Prevent multiple leading zeroes or duplicate decimals
      if (action.payload === "0" && state.currentOperand === "0") return state;
      if (action.payload === "." && state.currentOperand.includes(".")) return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload}`,
      };

    case "CHOOSE_OPERATION":
      if (state.currentOperand === "" && state.previousOperand === "") return state;
      if (state.currentOperand === "") {
        return {
          ...state,
          operation: action.payload,
        };
      }
      if (state.previousOperand === "") {
        return {
          ...state,
          operation: action.payload,
          previousOperand: state.currentOperand,
          currentOperand: "",
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: action.payload,
        currentOperand: "",
      };

    case "CLEAR":
      return initialState;

    case "DELETE_DIGIT":
      if (state.currentOperand === "") return state;
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case "EVALUATE":
      if (
        state.operation == null ||
        state.currentOperand === "" ||
        state.previousOperand === ""
      ) {
        return state;
      }
      return {
        ...state,
        previousOperand: "",
        operation: null,
        currentOperand: evaluate(state),
      };

    default:
      return state;
  }
}

// Helper function to evaluate the result
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";

  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    default:
      return "";
  }

  return computation.toString();
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>

      <button className="span-two" onClick={() => dispatch({ type: "CLEAR" })}>
        AC
      </button>
      <button onClick={() => dispatch({ type: "DELETE_DIGIT" })}>DEL</button>
      <button onClick={() => dispatch({ type: "CHOOSE_OPERATION", payload: "÷" })}>
        ÷
      </button>
      <button onClick={() => dispatch({ type: "ADD_DIGIT", payload: "1" })}>1</button>
      <button onClick={() => dispatch({ type: "ADD_DIGIT", payload: "2" })}>2</button>
      <button onClick={() => dispatch({ type: "ADD_DIGIT", payload: "3" })}>3</button>
      <button onClick={() => dispatch({ type: "CHOOSE_OPERATION", payload: "*" })}>
        *
      </button>
      <button onClick={() => dispatch({ type: "ADD_DIGIT", payload: "4" })}>4</button>
      <button onClick={() => dispatch({ type: "ADD_DIGIT", payload: "5" })}>5</button>
      <button onClick={() => dispatch({ type: "ADD_DIGIT", payload: "6" })}>6</button>
      <button onClick={() => dispatch({ type: "CHOOSE_OPERATION", payload: "+" })}>
        +
      </button>
      <button onClick={() => dispatch({ type: "ADD_DIGIT", payload: "7" })}>7</button>
      <button onClick={() => dispatch({ type: "ADD_DIGIT", payload: "8" })}>8</button>
      <button onClick={() => dispatch({ type: "ADD_DIGIT", payload: "9" })}>9</button>
      <button onClick={() => dispatch({ type: "CHOOSE_OPERATION", payload: "-" })}>
        -
      </button>
      <button onClick={() => dispatch({ type: "ADD_DIGIT", payload: "." })}>.</button>
      <button onClick={() => dispatch({ type: "ADD_DIGIT", payload: "0" })}>0</button>
      <button className="span-two" onClick={() => dispatch({ type: "EVALUATE" })}>
        =
      </button>
    </div>
  );
}

export default App;
