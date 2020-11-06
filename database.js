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
var Team = new Schema({
  _id: String,
  name: {
    type: String,
    default: "Sem nome"
  },
  members: {
    type: Array,
    default: []
  },
  role: String,
  channel: {
    text: String,
    voice: String
  },
  points: {
    type: Number,
    default: 0
  }
});

// Cria os models na database
var Users = mongoose.model('Users', User);
var Teams = mongoose.model('Teams', Team);

// Exporta os models para uso nos codigos
module.exports = {
  Users: Users,
  Teams: Teams
}