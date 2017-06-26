
(function(flow) {

	flow.then(function(oncomplete) {

		let entity = this.main.state.query('ui > project > select > search');
		entity.setValue('/projects/lethalmaze');
		entity.trigger('change', [ entity.value ]);

		setTimeout(function() {
			oncomplete(true);
		}, 200);

	});

	flow.then(function(oncomplete) {

		let entity = this.main.state.query('ui > menu');
		entity.setValue('Asset');
		entity.trigger('change', [ entity.value ]);

		setTimeout(function() {
			oncomplete(true);
		}, 1000);

	});

	flow.then(function(oncomplete) {

		let entity = this.main.state.query('ui > asset > select > search');
		entity.setValue('app/sprite/Tank.png');
		entity.trigger('change', [ entity.value ]);

		setTimeout(function() {
			oncomplete(true);
		}, 200);

	});

	// flow.then(function(oncomplete) {

	// 	let entity = this.main.state.query('ui > asset > modify > color');
	// 	entity.setValue('#ff00ff');
	// 	entity.trigger('change', [ entity.value ]);

	// 	entity = this.main.state.query('ui > asset > modify > size');
	// 	entity.setValue(100);
	// 	entity.trigger('change', [ entity.value ]);

	// 	entity = this.main.state.query('ui > asset > modify > style');
	// 	entity.setValue('italic');
	// 	entity.trigger('change', [ entity.value ]);

	// 	entity = this.main.state.query('ui > asset > modify > spacing');
	// 	entity.setValue(16);
	// 	entity.trigger('change', [ entity.value ]);

	// 	setTimeout(function() {
	// 		oncomplete(true);
	// 	}, 200);

	// });

	// flow.then(function(oncomplete) {

	// 	let entity = this.main.state.query('ui > asset > preview');
	// 	entity.trigger('relayout');

	// 	oncomplete(true);

	// });

	flow.bind('error', function(error) {
		console.error(error);
	});

	flow.bind('complete', function() {
		console.info('Flow completed.');
	});

	flow.init();

})(new lychee.app.Flow(this.MAIN));

