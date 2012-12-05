// templating
jQuery.fn.clonifyTemplate = function(selector) {
    return this
        .filter('.template')
        .clone()
        .removeClass('template')
        .appendTo(selector);
};

// model
var sections = [
    {
        name: 'Forside',
        articles:[
            {title: 'Windows', image:'http://www.fastforwardblog.com/wp-content/uploads/2011/01/BillGates-239x300.jpg'},
            {title: 'Office', image:'http://www.fastforwardblog.com/wp-content/uploads/2011/01/BillGates-239x300.jpg'},
            {title: 'SQL Server', image:'http://www.fastforwardblog.com/wp-content/uploads/2011/01/BillGates-239x300.jpg'}
        ]
    },
    {
        name: 'Sport',
        articles:[
            {title: 'Mac', image:'http://www.biography.com/imported/images/Biography/Images/Galleries/Steve%20Jobs/steve-jobs-photo-thumb.jpg'},
            {title: 'iPod', image:'http://www.biography.com/imported/images/Biography/Images/Galleries/Steve%20Jobs/steve-jobs-photo-thumb.jpg'},
            {title: 'iPhone', image:'http://www.biography.com/imported/images/Biography/Images/Galleries/Steve%20Jobs/steve-jobs-photo-thumb.jpg'},
            {title: 'iPad', image:'http://www.biography.com/imported/images/Biography/Images/Galleries/Steve%20Jobs/steve-jobs-photo-thumb.jpg'}
        ]
    },
    {
        name: 'Osloby',
        articles:[
            {title: 'Oracle', image:'http://www.zpub.com/un/larryhotdog.jpg'}
        ]
    }
];

$.get('http://localhost:8001/golf2', function(data) {
    // map xml from data feed to local json model (can skip this step later and read straight from the feed)
    var xml = $(data);
    var entries = xml.find('entry');

    var section = {};
    section.name = 'Golf';
    section.articles = [];
    entries.each(function(index, entry) {
        var article = {};
        console.log(entry);
        article.title = $(entry).find('title').text();
        article.image = $(entry).find('link[rel="teaserreal"]').attr("href").replace("{cropversion}", "w180c43");
        section.articles.push(article);
    });
    sections.push(section);


});


// Glue. Model -> DOM
var slides = $('.slides').detach();
var articleTemplate = $('.article.template').detach();
var sectionTemplate = $('.section.template').detach();

sections.forEach(function(section) {
    var sectionView = sectionTemplate.clonifyTemplate(slides);
    sectionView.find('.sectionName').text(section.name);

    section.articles.forEach(function(article) {
        var articleView = articleTemplate.clonifyTemplate(sectionView);
        articleView.find('.title').text(article.title);
        articleView.find('.image').attr({src: article.image});
    });
});

slides.appendTo('.reveal');




