import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  initialGates, initialRoutes, initialFoodStalls,
  initialWashrooms, initialEmergencyExits,
  simulateCrowdLevels, simulateRoutes,
  simulateFoodStalls, simulateWashrooms,
} from '../data/stadiumData';

const StadiumContext = createContext(null);

const initialState = {
  gates: initialGates,
  routes: initialRoutes,
  foodStalls: initialFoodStalls,
  washrooms: initialWashrooms,
  emergencyExits: initialEmergencyExits,
  queues: [],        // { id, type('food'|'washroom'), name, position, counter, maxPosition }
  points: parseInt(localStorage.getItem('stadium-points') || '0', 10),
  isEmergency: false,
  entered: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'TICK_CROWDS':
      return {
        ...state,
        gates: simulateCrowdLevels(state.gates),
        routes: simulateRoutes(state.routes),
        foodStalls: simulateFoodStalls(state.foodStalls),
        washrooms: simulateWashrooms(state.washrooms),
        emergencyExits: simulateCrowdLevels(state.emergencyExits),
      };

    case 'JOIN_QUEUE': {
      const exists = state.queues.find(q => q.id === action.payload.id);
      if (exists) return state;
      return {
        ...state,
        queues: [...state.queues, {
          ...action.payload,
          position: action.payload.position || Math.floor(Math.random() * 10) + 5,
          maxPosition: action.payload.position || Math.floor(Math.random() * 10) + 5,
          counter: Math.floor(Math.random() * 5) + 1,
          joinedAt: Date.now(),
        }],
      };
    }

    case 'ADVANCE_QUEUES':
      return {
        ...state,
        queues: state.queues.map(q =>
          q.position > 0
            ? { ...q, position: q.position - 1 }
            : q
        ),
      };

    case 'REMOVE_QUEUE':
      return {
        ...state,
        queues: state.queues.filter(q => q.id !== action.payload),
      };

    case 'ADD_POINTS': {
      const newPoints = state.points + action.payload;
      localStorage.setItem('stadium-points', String(newPoints));
      return { ...state, points: newPoints };
    }

    case 'TOGGLE_EMERGENCY':
      return { ...state, isEmergency: !state.isEmergency };

    case 'ENTER_STADIUM':
      return { ...state, entered: true };

    default:
      return state;
  }
}

export function StadiumProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Simulate crowd changes every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'TICK_CROWDS' });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Advance queues every 12s
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'ADVANCE_QUEUES' });
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const joinQueue = useCallback((queueData) => {
    dispatch({ type: 'JOIN_QUEUE', payload: queueData });
  }, []);

  const removeQueue = useCallback((id) => {
    dispatch({ type: 'REMOVE_QUEUE', payload: id });
  }, []);

  const addPoints = useCallback((pts) => {
    dispatch({ type: 'ADD_POINTS', payload: pts });
  }, []);

  const toggleEmergency = useCallback(() => {
    dispatch({ type: 'TOGGLE_EMERGENCY' });
  }, []);

  const enterStadium = useCallback(() => {
    dispatch({ type: 'ENTER_STADIUM' });
  }, []);

  return (
    <StadiumContext.Provider value={{
      ...state,
      joinQueue, removeQueue, addPoints,
      toggleEmergency, enterStadium,
    }}>
      {children}
    </StadiumContext.Provider>
  );
}

export function useStadium() {
  const ctx = useContext(StadiumContext);
  if (!ctx) throw new Error('useStadium must be used within StadiumProvider');
  return ctx;
}
