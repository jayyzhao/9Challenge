const router = new (require('restify-router')).Router();
var _ = require('underscore');

router.post('', function (req, res, next) {
	if(req.headers["content-type"] != 'application/json'){
		res.json(400, {error: "Could not decode request: JSON parsing failed"})
		next();
	}
	else{
		filteredDRM = _.where(req.body.payload, {"drm" : true})
		filteredEpisodes = _.filter(filteredDRM, function(shows){
			if(shows.episodeCount > 0){
				return shows
			}
		})
		
		var response = []

		for(index in filteredEpisodes){
			response.push({
				"image": filteredEpisodes[index].image.showImage,
				"slug": filteredEpisodes[index].slug,
				"title": filteredEpisodes[index].title
			})

		}
		console.log(response)
		res.json(200, {
			response: response
		})
		next();
	}
});

module.exports = router;