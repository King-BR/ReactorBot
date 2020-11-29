const { formatDate } = require("./utils.js");
var mongoose = require("mongoose");
var Schema = mongoose.Schema

// Tentar conectar na database
mongoose.connect(process.env.DATABASEURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}, error => {
  // Caso aconteça erro ao tentar conectar
  if (error) {
    console.log(`Erro: ${error}`);
    process.exit(1);
    return;
  }

  // Caso tenha sucesso ao conectar informa no console
  console.log("\nConectado ao banco de dados\n");
  return;
});

// Cria o Schema de warn
var Warn = new Schema({
  _id: String,
  reason: {
    type: String,
    default: "Sem razão informada"
  },
  pardon: {
    pardoned: {
      type: Boolean,
      default: false
    },
    by: String
  },
  date: {
    type: String,
    default: formatDate(new Date())
  }
});

// Cria o Schema de usuarios
var User = new Schema({
  _id: String,
  mindustryRP: {
    resources: {
      items: {
        blast_compound: {
          type: Number,
          default: 0
        },
        coal: {
          type: Number,
          default: 0
        },
        copper: {
          type: Number,
          default: 0
        },
        graphite: {
          type: Number,
          default: 0
        },
        lead: {
          type: Number,
          default: 0
        },
        metaglass: {
          type: Number,
          default: 0
        },
        phase_fabric: {
          type: Number,
          default: 0
        },
        plastanium: {
          type: Number,
          default: 0
        },
        pyratite: {
          type: Number,
          default: 0
        },
        sand: {
          type: Number,
          default: 0
        },
        scrap: {
          type: Number,
          default: 0
        },
        silicon: {
          type: Number,
          default: 0
        },
        spore_pod: {
          type: Number,
          default: 0
        },
        surge_alloy: {
          type: Number,
          default: 0
        },
        thorium: {
          type: Number,
          default: 0
        },
        titanium: {
          type: Number,
          default: 0
        }
      },
      liquids: {
        cryofluid: {
          type: Number,
          default: 0
        },
        oil: {
          type: Number,
          default: 0
        },
        slag: {
          type: Number,
          default: 0
        },
        water: {
          type: Number,
          default: 0
        }
      }
    },
    mechs: {
      alpha: {
        have: {
          type: Boolean,
          default: true
        },
        using: {
          type: Boolean,
          default: true
        }
      },
      dart: {
        have: {
          type: Boolean,
          default: false
        },
        using: {
          type: Boolean,
          default: false
        }
      },
      delta: {
        have: {
          type: Boolean,
          default: false
        },
        using: {
          type: Boolean,
          default: false
        }
      },
      glaive: {
        have: {
          type: Boolean,
          default: false
        },
        using: {
          type: Boolean,
          default: false
        }
      },
      javelin: {
        have: {
          type: Boolean,
          default: false
        },
        using: {
          type: Boolean,
          default: false
        }
      },
      omega: {
        have: {
          type: Boolean,
          default: false
        },
        using: {
          type: Boolean,
          default: false
        }
      },
      tau: {
        have: {
          type: Boolean,
          default: false
        },
        using: {
          type: Boolean,
          default: false
        }
      },
      trident: {
        have: {
          type: Boolean,
          default: false
        },
        using: {
          type: Boolean,
          default: false
        }
      }
    }
  },
  money: {
    type: Number,
    default: 0
  },
  levelSystem: {
    txp: {
      type: Number,
      default: 0
    },
    xp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    }
  },
  warn: {
    quant: {
      type: Number,
      default: 0
    },
    history: [Warn]
  }
});

// Cria o Schema de times
var Clan = new Schema({
  _id: String,
  name: {
    type: String,
    default: "Sem nome"
  },
  image: String,
  desc: {
    type: String,
    default: "Sem descrição"
  },
  level: {
    type: Number,
    default: 1
  },
  maxMembers: {
    type: Number,
    default: 10
  },
  founders: {
    type: Array,
    default: []
  },
  members: {
    type: Array,
    default: []
  },
  role: String,
  channel: {
    text: String,
    voice: String,
    category: String
  }
});

var Base = new Schema({
  _id: String,
  name: String,
  level: {
    type: Number,
    default: 1
  },
  blocks: {
    crafting: {
      alloy_smelter: {
        type: Number,
        default: 0
      },
      blast_mixer: {
        type: Number,
        default: 0
      },
      coal_centrifuge: {
        type: Number,
        default: 0
      },
      cryofluidmixer: {
        type: Number,
        default: 0
      },
      graphite_press: {
        type: Number,
        default: 0
      },
      incinerator: {
        type: Number,
        default: 0
      },
      kiln: {
        type: Number,
        default: 0
      },
      melter: {
        type: Number,
        default: 0
      },
      multi_press: {
        type: Number,
        default: 0
      },
      phase_weaver: {
        type: Number,
        default: 0
      },
      plastanium_compressor: {
        type: Number,
        default: 0
      },
      pulverizer: {
        type: Number,
        default: 0
      },
      pýratite_mixer: {
        type: Number,
        default: 0
      },
      separator: {
        type: Number,
        default: 0
      },
      silicon_smelter: {
        type: Number,
        default: 0
      },
      spore_press: {
        type: Number,
        default: 0
      }
    },
    defense: {
      copper_wall_large: {
        type: Number,
        default: 0
      },
      copper_wall: {
        type: Number,
        default: 0
      },
      door_large: {
        type: Number,
        default: 0
      },
      door: {
        type: Number,
        default: 0
      },
      phase_wall_large: {
        type: Number,
        default: 0
      },
      phase_wall: {
        type: Number,
        default: 0
      },
      plastanium_wall_large: {
        type: Number,
        default: 0
      },
      plastanium_wall: {
        type: Number,
        default: 0
      },
      scrap_wall_gigantic: {
        type: Number,
        default: 0
      },
      scrap_wall_huge: {
        type: Number,
        default: 0
      },
      scrap_wall_large: {
        type: Number,
        default: 0
      },
      scrap_wall: {
        type: Number,
        default: 0
      },
      surge_wall_large: {
        type: Number,
        default: 0
      },
      surge_wall: {
        type: Number,
        default: 0
      },
      thorium_wall_large: {
        type: Number,
        default: 0
      },
      thorium_wall: {
        type: Number,
        default: 0
      },
      titanium_wall_large: {
        type: Number,
        default: 0
      },
      titanium_wall: {
        type: Number,
        default: 0
      }
    },
    distribution: {
      armored_conveyor: {
        type: Number,
        default: 0
      },
      bridge_conveyor: {
        type: Number,
        default: 0
      },
      conveyor: {
        type: Number,
        default: 0
      },
      distributor: {
        type: Number,
        default: 0
      },
      inverted_sorter: {
        type: Number,
        default: 0
      },
      item_source: {
        type: Number,
        default: 0
      },
      item_void: {
        type: Number,
        default: 0
      },
      junction: {
        type: Number,
        default: 0
      },
      mass_driver: {
        type: Number,
        default: 0
      },
      overflow_gate: {
        type: Number,
        default: 0
      },
      phase_conveyor: {
        type: Number,
        default: 0
      },
      router: {
        type: Number,
        default: 0
      },
      sorter: {
        type: Number,
        default: 0
      },
      titanium_conveyor: {
        type: Number,
        default: 0
      },
      underflow_gate: {
        type: Number,
        default: 0
      }
    },
    effect: {
    },
    liquid: {
    },
    power: {
    },
    production: {
    },
    turret: {
    },
    units: {
    },
    upgrade: {
    }
  },
  resources: {
    items: {
      blast_compound: {
        type: Number,
        default: 0
      },
      coal: {
        type: Number,
        default: 0
      },
      copper: {
        type: Number,
        default: 0
      },
      graphite: {
        type: Number,
        default: 0
      },
      lead: {
        type: Number,
        default: 0
      },
      metaglass: {
        type: Number,
        default: 0
      },
      phase_fabric: {
        type: Number,
        default: 0
      },
      plastanium: {
        type: Number,
        default: 0
      },
      pyratite: {
        type: Number,
        default: 0
      },
      sand: {
        type: Number,
        default: 0
      },
      scrap: {
        type: Number,
        default: 0
      },
      silicon: {
        type: Number,
        default: 0
      },
      spore_pod: {
        type: Number,
        default: 0
      },
      surge_alloy: {
        type: Number,
        default: 0
      },
      thorium: {
        type: Number,
        default: 0
      },
      titanium: {
        type: Number,
        default: 0
      }
    },
    liquids: {
      cryofluid: {
        type: Number,
        default: 0
      },
      oil: {
        type: Number,
        default: 0
      },
      slag: {
        type: Number,
        default: 0
      },
      water: {
        type: Number,
        default: 0
      }
    }
  }
})

// Cria os models na database
var Users = mongoose.model('Users', User);
var Clans = mongoose.model('Clans', Clan);
var Bases = mongoose.model('Bases', Base);

// Exporta os models para uso nos codigos
module.exports = {
  Users: Users,
  Clans: Clans,
  Bases: Bases
}