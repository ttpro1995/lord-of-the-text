export const initialState = {
  playerName: "Lord",
  resources: {
    timber: 100,
    stone: 100,
    iron: 20,
    food: 20,
    gold: 20,
    knowledge: 20
  },
  buildings: {
    "Lumber-Camp": 0,
    "Farm": 0,
    "Quarry": 0,
    "Iron-Mine": 0,
    "Barracks": 0,
    "Warehouse": 0
  },
  units: [],
  unitQueue: [],
  notifications: [],
  version: "v0.3"
};

export const RESOURCE_CAPS = {
  timber: 200,
  stone: 200,
  iron: 200,
  food: 200,
  gold: 200,
  knowledge: 200
};