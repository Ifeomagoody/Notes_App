
const Note = require('../models/Notes')
const mongoose = require('mongoose')

/**
 * GET /
 * Homepage
 */

exports.dashboard = async (req, res) => {

     let perPage = 12;
     let page = req.query.page || 1;


    const locals = {
      title: "Dashboard",
      description: "Free NodeJs Notes App",
    };

try {
      
         Note.aggregate([
          {
            $sort: {   updatedAt: -1, } },      //the {-1} represents the newest first
        { $match: { user: mongoose.Types.ObjectId(req.user.id) }},
           {
          $project: {
            title: { $substr: ['$title', 0, 30]} ,             //30 characters for the body
            body: { $substr: ['$body', 0, 100]}
          }
        }
         ])
         .skip(perPage * page - perPage)    //for the first page, it is 1 * 2 - the cureent page
          .limit(perPage)                   //the number of pages we get are limited
          .exec(function (err, notes) {       //
            Note.count().exec(function (err, count) {
              if (err) return next(err)

         res.render("dashboard/index", {
             userName: req.user.firstName,
             locals,
             notes,
             layout: "../views/layouts/dashboard",
             current: page,
             pages: Math.ceil(count / perPage)
 });
            })
          })


} catch (error) {
   console.log(error)
}

 
  /*await Note.insertMany([
    {
      user: "65rdsw357jngfgdse",
      title: "NodeJs Tutorial",
      body: "Node.Js is an open-source server environment. NodeJs is cross platform and "
      createdAt: "1234759378"
    },
    {
      user: "65rdsw357jngfgdse",
      title: "NodeJs Tutorial",
      body: "Node.Js is an open-source server environment. NodeJs is cross platform and "
      createdAt: "1234759378"
    },
    {
      user: "65rdsw357jngfgdse",
      title: "NodeJs Tutorial",
      body: "Node.Js is an open-source server environment. NodeJs is cross platform and "
      createdAt: "1234759378"
    },
    {
      user: "65rdsw357jngfgdse",
      title: "NodeJs Tutorial",
      body: "Node.Js is an open-source server environment. NodeJs is cross platform and "
      createdAt: "1234759378"
    },
    {
      user: "65rdsw357jngfgdse",
      title: "NodeJs Tutorial",
      body: "Node.Js is an open-source server environment. NodeJs is cross platform and "
      createdAt: "1234759378"
    }

  ])*/
};


/**
 * GET /
 * View Specific Note
 */

exports.dashboardViewNote = async(req, res) => {
const note = await Note.findById({ _id: req.params.id })
.where({ user: req.user.id }).lean()

if(note) {
  res.render('dashboard/view-note', {
    noteId: req.params.id,
    note,
    layout: '../views/layouts/dashboard'
  })
} else {
  res.send("Something went wrong")
}

}


/**
 * POST /
 * Update Specific Note
 */

exports.dashboardUpdateNote = async(req, res) => {
try {


  await Note.findOneAndUpdate(
    {_id: req.params.id },
    { title: req.body.title, body: req.body.body, updatedAt: Date.now()  }
  ).where ({ user: req.user.id} )


  res.redirect('/dashboard')


} catch (error) {
  console.log(error)
}

}



/**
 * DELETE /
 * Delete Note
 */
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({_id: req.params.id}).where({user: req.user.id})
         res.redirect('/dashboard')

  } catch (error){
    console.log(error)

  }
}



/**
 * GET /
 * Add Notes
 */
exports.dashboardAddNote = async (req, res) => {
  res.render('dashboard/add', {
    layout: '../views/layouts/dashboard'
  })
}



/**
 * POST
 * Add Notes
 */

exports.dashboardViewNoteSubmit = async (req, res) => {

try {
  req.body.user = req.user.id
  await Note.create(req.body)
  res.redirect('/dashboard')
} catch (error) {
  console.log(error)
}



}


/**
 * GET
 * Search
 */

exports.dashboardSearch = async (req, res) => {
  try {
    res.render('dashboard/search', {
      searchResults: ' ', 
      layout: '../views/layouts/dashboard'
    })
  } catch (error) {
    
  }
}


/**
 * POST
 * Search for the Notes
 */

exports.dashboardSearchSubmit = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm
    const searchNoSpaecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpaecialChars, 'i') }},
        { body: { $regex: new RegExp(searchNoSpaecialChars, 'i') }}

      ]
    }).where( { user: req.user.id })

    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });



  } catch (error) {
    console.log(error)
  }
}