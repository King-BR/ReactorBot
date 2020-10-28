const format = require("date-fns/format");
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
  console.log("\nConectado ao banco de dados\n");
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
    default: format(new Date(), "dd/MM/yyyy HH:mm:SS")
  }

})

var User = new Schema({
  _id: String,
  mindustryRP: {
    resources: {
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
      },
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
    },
    ships: {
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
  activity: {
    messages: {
      type: Array,
      default: [0,0,0,0,0,0,0,0,0]
    },
    totalMsg: {
      type: Number,
      default: 0
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
})

var Users = mongoose.model('Users', User)
exports.Users = Users