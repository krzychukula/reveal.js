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

// feed data to model
function createSection(name, data) {
    var xml = $(data);
    var entries = xml.find('entry');

    var section = {};
    section.name = name;
    section.articles = [];
    entries.each(function(index, entry) {
        var article = {};
        console.log(entry);
        article.title = $(entry).find('title').text();
        if($(entry).find('link[rel="teaserreal"]').attr("href")) {
            article.image = $(entry).find('link[rel="teaserreal"]').attr("href").replace("{cropversion}", "w180c43");
        }
        section.articles.push(article);
    });
    return section;
}

function modelToDom(sections) {
    var slides = $('.slides').detach();
    var articleTemplate = $('.article.template').detach();
    var sectionTemplate = $('.section.template').detach();

    sections.forEach(function(section) {
        var sectionView = sectionTemplate.clonifyTemplate(slides);
        sectionView.find('.sectionName').text(section.name);

        section.articles.forEach(function(article) {
            var articleView = articleTemplate.clonifyTemplate(sectionView);
            articleView.find('.title').text(article.title);
            if(article.image) {
                articleView.find('.image').attr({src: article.image});
            } else {
                articleView.find('.image').remove();
            }
        });
    });

    slides.appendTo('.reveal');
}

$.when($.get('http://apitestbeta3.medianorge.no/news/publication/common/escenic/section/222/auto'),
       $.get('http://apitestbeta3.medianorge.no/news/publication/common/escenic/section/222/auto'))
 .done(function(result1, result2) {
        sections.push(createSection('Football', result1));
        sections.push(createSection('Snowboard', result2));
        modelToDom(sections);
 });






