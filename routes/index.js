const express = require('express');
const router = express.Router();

// let pets = require('../json/pets')
const model = require('../db/models/');

/* GET home page. */
router.get('/', (req, res) => {
  model.Pet.findAll().then(pets => {
    res.render('pets-index', { pets: pets });
  })
});


/* Search page. */
router.get('/search', (req, res) => {
    model.Pet.findAll(
        {
            where: {
                name: {
                  $iLike: "%" + req.query.name + "%"
                }
            }
        }
    ).then(pets => {
      res.render('pets-index', { pets: pets });
    });

});
module.exports = router;

/*  Pagination. */
//Use the code from Web 3
// https://github.com/Product-College-Courses/WEB-3-Advanced
//-Web-Patterns/tree/master/05.%20Simple%20Search%20%26%20Pagination

router.get('/:page', (req, res) => {
  let limit = 3;   // number of records per page
  let offset = 0;

  model.Pet.findAndCountAll().then((data) => {
    let page = req.params.page;      // page number
    let pages = Math.ceil(data.count / limit);
		// offset = limit * (page - 1);
    model.Pet.findAll({
      limit: limit,
      offset: offset,
      $sort: { id: 1 }
    }).then((pets) => {
      res.render('pets-index', { pets, count: data.count, pages});
    });
  })
  .catch(function (error) {
		res.status(500).send('Internal Server Error');
	});
});
