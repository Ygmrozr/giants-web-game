const gameLevels = {
  1: {
    name: "Training District",
    background: "/images/levels/level1.png",
    sectors: {
      1: { objectiveType: "kill", objectiveText: "Defeat a giant", enemyCount: 1, reward: 50},
      2: { objectiveType: "kill", objectiveText: "Defeat a giant", enemyCount: 1, reward: 60},
      3: { objectiveType: "kill", objectiveText: "Defeat 2 giants", enemyCount: 2, reward: 70},
      4: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 80},
      5: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 90},
      6: { objectiveType: "kill", objectiveText: "Defeat 4 giants", enemyCount: 4, reward: 100},
      7: { objectiveType: "kill", objectiveText: "Defeat 5 giants", enemyCount: 5, reward: 110},
      8: { objectiveType: "kill", objectiveText: "Defeat 6 giants", enemyCount: 6, reward: 120},
      9: { objectiveType: "kill", objectiveText: "Defeat 7 giants", enemyCount: 7, reward: 140},
      10: { objectiveType: "kill", objectiveText: "Defeat the boss giant", enemyCount: 1, reward: 200}
    }
  },

  2: {
    name: "Karanese",
    background: "/images/levels/level2.png",
    sectors: {
      1: { objectiveType: "kill", objectiveText: "Defeat a giant", enemyCount: 1, reward: 50},
      2: { objectiveType: "kill", objectiveText: "Defeat a giant", enemyCount: 1, reward: 60},
      3: { objectiveType: "kill", objectiveText: "Defeat 2 giants", enemyCount: 2, reward: 70},
      4: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 80},
      5: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 90},
      6: { objectiveType: "kill", objectiveText: "Defeat 4 giants", enemyCount: 4, reward: 100},
      7: { objectiveType: "kill", objectiveText: "Defeat 5 giants", enemyCount: 5, reward: 110},
      8: { objectiveType: "kill", objectiveText: "Defeat 6 giants", enemyCount: 6, reward: 120},
      9: { objectiveType: "kill", objectiveText: "Defeat 7 giants", enemyCount: 7, reward: 140},
      10: { objectiveType: "kill", objectiveText: "Defeat the boss giant", enemyCount: 1, reward: 200}
    }
  },

  3: {
  name: "Stohess",
  background: "/images/levels/level3.png",
  sectors: {
    1: {
      objectiveType: "rescue",
      objectiveText: "Rescue 1 civilian from Stohess District",
      civilianTarget: 1,
      enemyCount: 1,
      reward: 140
    },
    2: {
      objectiveType: "rescue",
      objectiveText: "Escort 1 civilian to the extraction zone",
      civilianTarget: 1,
      enemyCount: 1,
      reward: 155
    },
    3: {
      objectiveType: "rescue",
      objectiveText: "Rescue 2 civilians during the Female Titan pursuit",
      civilianTarget: 2,
      enemyCount: 1,
      reward: 175
    },
    4: {
      objectiveType: "rescue",
      objectiveText: "Protect and extract 2 civilians under attack",
      civilianTarget: 2,
      enemyCount: 1,
      reward: 195
    },
    5: {
      objectiveType: "kill",
      objectiveText: "Defeat the Female Titan",
      enemyCount: 1,
      reward: 250
    }
  }
},

  4: {
    name: "Castle Utgard",
    background: "/images/levels/level4.png",
    sectors: {
      1: { objectiveType: "kill", objectiveText: "Defeat a giant", enemyCount: 1, reward: 50},
      2: { objectiveType: "kill", objectiveText: "Defeat a giant", enemyCount: 1, reward: 60},
      3: { objectiveType: "kill", objectiveText: "Defeat 2 giants", enemyCount: 2, reward: 70},
      4: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 80},
      5: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 90},
      6: { objectiveType: "kill", objectiveText: "Defeat 4 giants", enemyCount: 4, reward: 100},
      7: { objectiveType: "kill", objectiveText: "Defeat 5 giants", enemyCount: 5, reward: 110},
      8: { objectiveType: "kill", objectiveText: "Defeat 6 giants", enemyCount: 6, reward: 120},
      9: { objectiveType: "kill", objectiveText: "Defeat 7 giants", enemyCount: 7, reward: 140},
      10: { objectiveType: "kill", objectiveText: "Defeat the boss giant", enemyCount: 1, reward: 200}
    }
  },

  5: {
    name: "Final Breach",
    background: "/images/levels/level5.png",
    sectors: {
      1: { objectiveType: "kill", objectiveText: "Defeat a giant", enemyCount: 1, reward: 50},
      2: { objectiveType: "kill", objectiveText: "Defeat a giant", enemyCount: 1, reward: 60},
      3: { objectiveType: "kill", objectiveText: "Defeat 2 giants", enemyCount: 2, reward: 70},
      4: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 80},
      5: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 90},
      6: { objectiveType: "kill", objectiveText: "Defeat 4 giants", enemyCount: 4, reward: 100},
      7: { objectiveType: "kill", objectiveText: "Defeat 5 giants", enemyCount: 5, reward: 110},
      8: { objectiveType: "kill", objectiveText: "Defeat 6 giants", enemyCount: 6, reward: 120},
      9: { objectiveType: "kill", objectiveText: "Defeat 7 giants", enemyCount: 7, reward: 140},
      10: { objectiveType: "collect", objectiveText: "Defeat the boss giant", targetitem: 1, enemyCount: 1, reward: 200}
    }
  }
};

export default gameLevels;