const gameLevels = {
  1: {
    name: "Training District",
    background: "/images/levels/level1.png",
    sectors: {

      1: { objectiveType: "kill", objectiveText: "Defeat a giant", enemyCount: 1, reward: 50},
      2: { objectiveType: "collect", objectiveText: "Collect 2 gasses", itemTarget: 2, enemyCount: 4, reward: 60},
      3: { objectiveType: "kill", objectiveText: "Defeat 2 giants", enemyCount: 2, reward: 70},
      4: { objectiveType: "kill", objectiveText: "Defeat 3 giants", enemyCount: 3, reward: 80},
      5: { objectiveType: "collect", objectiveText: "Collect 3 gasses", itemTarget: 3, enemyCount: 6, reward: 90},
      6: { objectiveType: "kill", objectiveText: "Defeat 4 giants", enemyCount: 4, reward: 100},
      7: { objectiveType: "kill", objectiveText: "Defeat 5 giants", enemyCount: 5, reward: 110},
      8: { objectiveType: "reach", objectiveText: "Reach the inner district", enemyCount: 7, reward: 120},
      9: { objectiveType: "kill", objectiveText: "Defeat 6 giants", enemyCount: 6, reward: 140},
      10: { objectiveType: "kill", objectiveText: "Defeat the boss giant", enemyCount: 1, reward: 200}

    }
  },

  2: {
    name: "Karanese",
    background: "/images/levels/level2.png",
    sectors: {
    1: { objectiveType: "kill", objectiveText: "Clear the road out of Karanese", enemyCount: 3, reward: 90 },
    2: { objectiveType: "collect", objectiveText: "Collect 2 gas supplies for the forest route", itemTarget: 2, enemyCount: 3, reward: 100 },
    3: { objectiveType: "kill", objectiveText: "Defeat Titans blocking the outer gate", enemyCount: 4, reward: 110 },
    4: { objectiveType: "reach", objectiveText: "Reach the path to the Giant Forest", enemyCount: 5, reward: 120 },
    5: { objectiveType: "kill", objectiveText: "Stop Titans from entering the forest", enemyCount: 5, reward: 140 },
    6: { objectiveType: "collect", objectiveText: "Collect 3 gas canisters for ODM movement", itemTarget: 3, enemyCount: 5, reward: 150 },
    7: { objectiveType: "kill", objectiveText: "Defend the forest entrance", enemyCount: 6, reward: 160 },
    8: { objectiveType: "reach", objectiveText: "Advance deeper into the Giant Forest", enemyCount: 6, reward: 180 },
    9: { objectiveType: "kill", objectiveText: "Eliminate Titans roaming between the trees", enemyCount: 7, reward: 200 },
    10: { objectiveType: "kill", objectiveText: "Defeat the Abnormal Titan guarding the forest path", enemyCount: 1, reward: 260 }
  }
  },

  3: {
    name: "Stohess",
    background: "/images/levels/level3.png",
    sectors: {
    1: { objectiveType: "reach", objectiveText: "Enter Stohess District", enemyCount: 1, reward: 140 },
    2: { objectiveType: "collect", objectiveText: "Collect 2 investigation clues", itemTarget: 2, enemyCount: 1, reward: 155 },
    3: { objectiveType: "reach", objectiveText: "Reach the underground passage", enemyCount: 1, reward: 170 },
    4: { objectiveType: "collect", objectiveText: "Collect 3 operation supplies", itemTarget: 3, enemyCount: 1, reward: 185 },
    5: { objectiveType: "reach", objectiveText: "Reach the central plaza", enemyCount: 1, reward: 200 },
    6: { objectiveType: "kill", objectiveText: "Survive Annie's first attack", enemyCount: 1, reward: 230 },
    7: { objectiveType: "reach", objectiveText: "Find Eren to fight Annie", enemyCount: 1, reward: 250 },
    8: { objectiveType: "collect", objectiveText: "Collect 3 gas supplies for the final chase", itemTarget: 3, enemyCount: 1, reward: 270 },
    9: { objectiveType: "reach", objectiveText: "Reach the final confrontation zone", enemyCount: 1, reward: 300 },
    10: { objectiveType: "kill", objectiveText: "Defeat the Female Titan", enemyCount: 1, reward: 400 }
  }
  },

  4: {
    name: "Castle Utgard",
    background: "/images/levels/level4.png",
    sectors: {
    1: { objectiveType: "kill", objectiveText: "Defend the castle walls", enemyCount: 4, reward: 120 },
    2: { objectiveType: "collect", objectiveText: "Collect 2 emergency supplies inside the castle", itemTarget: 2, enemyCount: 4, reward: 130 },
    3: { objectiveType: "kill", objectiveText: "Stop Titans climbing the outer walls", enemyCount: 5, reward: 145 },
    4: { objectiveType: "reach", objectiveText: "Reach the upper tower", enemyCount: 5, reward: 155 },
    5: { objectiveType: "kill", objectiveText: "Hold the tower against the Titan wave", enemyCount: 6, reward: 170 },
    6: { objectiveType: "collect", objectiveText: "Collect 3 gas supplies before night falls", itemTarget: 3, enemyCount: 6, reward: 185 },
    7: { objectiveType: "kill", objectiveText: "Protect the remaining soldiers", enemyCount: 7, reward: 200 },
    8: { objectiveType: "reach", objectiveText: "Reach the castle exit route", enemyCount: 7, reward: 220 },
    9: { objectiveType: "kill", objectiveText: "Break through the final Titan wave", enemyCount: 8, reward: 240 },
    10: { objectiveType: "kill", objectiveText: "Defeat the Titan leading Ymir", enemyCount: 1, reward: 300 }
  }
  },

  5: {
    name: "Final Breach",
    background: "/images/levels/level5.png",
    sectors: {
    1: { objectiveType: "kill", objectiveText: "Clear the outer streets of Shiganshina", enemyCount: 6, reward: 180 },
    2: { objectiveType: "collect", objectiveText: "Collect 3 gas supplies for the final operation", itemTarget: 3, enemyCount: 6, reward: 200 },
    3: { objectiveType: "reach", objectiveText: "Reach the sealed gate", enemyCount: 7, reward: 220 },
    4: { objectiveType: "kill", objectiveText: "Defeat Titans surrounding the gate", enemyCount: 8, reward: 240 },
    5: { objectiveType: "collect", objectiveText: "Collect 4 emergency supplies for the squad", itemTarget: 4, enemyCount: 8, reward: 260 },
    6: { objectiveType: "kill", objectiveText: "Hold the line against the Titan assault", enemyCount: 9, reward: 280 },
    7: { objectiveType: "reach", objectiveText: "Reach the final battle zone", enemyCount: 9, reward: 300 },
    8: { objectiveType: "kill", objectiveText: "Eliminate the Titans blocking the path to victory", enemyCount: 10, reward: 330 },
    9: { objectiveType: "collect", objectiveText: "Collect final gas supplies before the boss fight", itemTarget: 5, enemyCount: 10, reward: 360 },
    10: { objectiveType: "kill", objectiveText: "Defeat the final boss Titan and reclaim Shiganshina", enemyCount: 1, reward: 500 }
  }
  }
};

export default gameLevels;