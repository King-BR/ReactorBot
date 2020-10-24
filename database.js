const { formatDate } = require("./utils.js");
var mongoose = require("mongoose");
var Schema = mongoose.Schema

mongoose.connect(process.env.DATABASEURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}, error => {
  if (error) {
    console.log(`Erro: ${error}`);
    process.exit(1);
    return 1;
  }
  console.log("Conectado ao banco de dados");
  return 0;
});

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

})

var User = new Schema({
  _id: String,
  mindustryRP: {
    resources: {
      blast_compound: {
        id: 0,
        quant: {
          type: Number,
          default: 0
        }
      },
      coal: {
        id: 1,
        quant: {
          type: Number,
          default: 0
        }
      },
      copper: {
        id: 2,
        quant: {
          type: Number,
          default: 0
        }
      },
      graphite: {
        id: 3,
        quant: {
          type: Number,
          default: 0
        }
      },
      lead: {
        id: 4,
        quant: {
          type: Number,
          default: 0
        }
      },
      metaglass: {
        id: 5,
        quant: {
          type: Number,
          default: 0
        }
      },
      phase_fabric: {
        id: 6,
        quant: {
          type: Number,
          default: 0
        }
      },
      plastanium: {
        id: 7,
        quant: {
          type: Number,
          default: 0
        }
      },
      pyratite: {
        id: 8,
        quant: {
          type: Number,
          default: 0
        }
      },
      sand: {
        id: 9,
        quant: {
          type: Number,
          default: 0
        }
      },
      scrap: {
        id: 10,
        quant: {
          type: Number,
          default: 0
        }
      },
      silicon: {
        id: 11,
        quant: {
          type: Number,
          default: 0
        }
      },
      spore_pod: {
        id: 12,
        quant: {
          type: Number,
          default: 0
        }
      },
      surge_alloy: {
        id: 13,
        quant: {
          type: Number,
          default: 0
        }
      },
      thorium: {
        id: 14,
        quant: {
          type: Number,
          default: 0
        }
      },
      titanium: {
        id: 15,
        quant: {
          type: Number,
          default: 0
        }
      },
      cryofluid: {
        id: 16,
        quant: {
          type: Number,
          default: 0
        }
      },
      oil: {
        id: 17,
        quant: {
          type: Number,
          default: 0
        }
      },
      slag: {
        id: 18,
        quant: {
          type: Number,
          default: 0
        }
      },
      water: {
        id: 19,
        quant: {
          type: Number,
          default: 0
        }
      }
    },
    ships: {
      alpha: {
        id: 20,
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
        id: 21,
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
        id: 22,
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
        id: 23,
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
        id: 24,
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
        id: 25,
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
        id: 26,
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
        id: 27,
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
  economy: {
    money: {
      type: Number,
      default: 0
    }
  },
  levelSystem: {
    xp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 0
    }
  },
  warn: {
    quant: {
      type: Number,
      default: 0
    },
    history: [Warn]
  }
})

var Users = mongoose.model('Users', User)
exports.Users = Users