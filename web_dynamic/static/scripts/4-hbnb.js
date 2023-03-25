window.addEventListener('load', function () {
  $.ajax('http://0.0.0.0:5001/api/v1/status').done(function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  const amenityIds = {};
  $('input[type=checkbox]').click(function () {
    if ($(this).prop('checked')) {
      amenityIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      delete amenityIds[$(this).attr('data-id')];
    }
    if (Object.keys(amenityIds).length === 0) {
      $('div.amenities h4').html('&nbsp');
    } else {
      $('div.amenities h4').text(Object.values(amenityIds).join(', '));
    }
  });


  $('section.filters button').on('click', function () {
    let allChecked = $('li :checkbox:checked').map(function () {
      return $(this).attr('data-name');
    });

    console.log(allChecked);
    console.log(allChecked.length);

    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({amenities: allChecked})
    }).done((res) => {
      console.log(res);
      console.log('Response changing amenities: ' + res);
      const places = $('section.places');
      places.empty();

      for (let place of res) {
        let article = $('<article></article>');

        article.append('<div class="price_by_night">$' + place.price_by_night + '</div>');
        article.append('<h2>' + place.name + '</h2>');
        let subdiv = $('<div class="informations"></div>');
        subdiv.append('<div class="max_guest">' + place.max_guest + ' Guests</div>');
        subdiv.append('<div class="number_rooms">' + place.number_rooms + ' Rooms</div>');
        subdiv.append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathrooms</div>');
        article.append(subdiv);
        article.append('<div class="description">' + place.description + '</div>');

        places.append(article);
      }
    });
  });
});
