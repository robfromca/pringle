/**
 * Created by romeyer on 3/21/14.
 */

function addAlertTo(element) {
    $('<div/>', {
        class: 'alert alert-danger',
        id: 'activeIssue',
        text: "Unable to load description"
    }).appendTo(element);
}

function scrollElementToMiddle(el) {
    var elOffset = el.offset().top;
    var elHeight = el.height();
    var windowHeight = $(window).height();
    var offset;

    if (elHeight < windowHeight) {
        offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
    }
    else {
        offset = elOffset;
    }
    var scrollSpeed = 700;
    $('html, body').animate({scrollTop:offset}, scrollSpeed);
}

function getCard(cardNumber, e){
    console.log('CardNumber=' + cardNumber);
    $('<div/>', {
        class: 'alert alert-info',
        id: 'loading'
    }).append(
        $('<img/>', {
                src: '/images/ajax-loader.gif'
            }
        )
    ).appendTo(e);
    $.ajax({
        url: "/card/" + cardNumber,
        context: e,
        dataType: 'json'
    }).done(function(data) {
        $('#activeIssue').remove();
        $('#loading').remove();
        console.log(data);
        if (data.errors) {
            addAlertTo($(this));
        } else {
            console.log(data.card.description[0]);
            $('<div/>', {
                class: 'alert alert-info',
                id: 'activeIssue',
                html: data.card.description[0]
            }).appendTo($(this));
        }
        scrollElementToMiddle($("#activeIssue"));
    }).fail(function() {
        $('#activeIssue').remove();
        $('#loading').remove();
        addAlertTo($(this));
    });
};


$(function(){
    $('.card_num').on('click', function(e) {
        console.log($(e.target).closest('tr').data("card_num"));
        console.log("----");
        console.log($(e.target).closest('tr').children('.description-cell'));
        console.log("----");
        console.log(e);

        getCard($(e.target).closest('tr').data("card_num"),
            $(e.target).closest('tr').children('.description-cell'));
    });
});

