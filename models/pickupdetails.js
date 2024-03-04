const mongoose = require("mongoose");
const { Schema } = mongoose;

const pickupSchema = new Schema({

  tripId: {
    type: String,
    required: true,
    unique : true
  },

  transanction_hash: {
    type: String,
    required: true
  },

  additional_notes: {
    type: String
  },

  condition: {
    front: {
      bumper: {
        type: String
      },
      glass: {
        type: String
      },
      lshoulder: {
        type: String
      },
      rshoulder: {
        type: String
      }
    },
    back: {
      bumper: {
        type: String
      },
      glass: {
        type: String
      },
      lshoulder: {
        type: String
      },
      rshoulder: {
        type: String
      }
    },
    side: {
      lf_door: {
        type: String
      },
      rf_door: {
        type: String
      },
      lb_door: {
        type: String
      },
      rb_door: {
        type: String
      }
    },
    interior: {
      dashboard: {
        type: String
      },
      glovebox: {
        type: String
      },
      gearknob: {
        type: String
      },
      trunk: {
        type: String
      },
      backseat: {
        type: String
      },
      frontseat: {
        type: String
      }
    },
    overall_comments: {
      type: String
    },
    overall_picture: {
      type: String
    },
  },
  rating: {
    front: {
      type: Number
    },
    back: {
      type: Number
    },
    side: {
      type: Number
    },
    interior: {
      type: Number
    }
  },
  ownershipDetails: {
    rc: {
      type: String
    },
    pollutionpaper: {
      type: String,
    },
    insurance: {
      type: String,
    },
  },
  job_sheet : {
    type : [String]
  },
  inventory_sheet: {
    check_sheet : {
      stereo : {
        type : [String]
      },
      car : {
        type : [String]
      },
      vanity : {
        type : [String]
      }
    },
    fuelGaze : {
      image : {
        type : String
      },
      level : {
        type : String
      }
    },
    stepney : {
      type : String
    }
  },
});

module.exports = new mongoose.model("Pickup", pickupSchema);
