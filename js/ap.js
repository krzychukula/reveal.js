// templating
jQuery.fn.clonifyTemplate = function(selector) {
    return this
        .filter('.template')
        .clone()
        .removeClass('template')
        .appendTo(selector);
};


var feeds = [
    { name: 'Economy', url: 'http://apitestbeta3.medianorge.no/news/publication/ap/escenic/section/12/auto'},
    { name: 'Innenriks', url: 'http://apitestbeta3.medianorge.no/news/publication/ap/escenic/section/42/auto'}
]

// model
var sections = [
//    {
//        name: 'Forside',
//        articles:[
//            {title: 'Windows', image:'http://www.fastforwardblog.com/wp-content/uploads/2011/01/BillGates-239x300.jpg'},
//            {title: 'Office', image:'http://www.fastforwardblog.com/wp-content/uploads/2011/01/BillGates-239x300.jpg'},
//            {title: 'SQL Server', image:'http://www.fastforwardblog.com/wp-content/uploads/2011/01/BillGates-239x300.jpg'}
//        ]
//    },
//    {
//        name: 'Sport',
//        articles:[
//            {title: 'Mac', image:'http://www.biography.com/imported/images/Biography/Images/Galleries/Steve%20Jobs/steve-jobs-photo-thumb.jpg'},
//            {title: 'iPod', image:'http://www.biography.com/imported/images/Biography/Images/Galleries/Steve%20Jobs/steve-jobs-photo-thumb.jpg'},
//            {title: 'iPhone', image:'http://www.biography.com/imported/images/Biography/Images/Galleries/Steve%20Jobs/steve-jobs-photo-thumb.jpg'},
//            {title: 'iPad', image:'http://www.biography.com/imported/images/Biography/Images/Galleries/Steve%20Jobs/steve-jobs-photo-thumb.jpg'}
//        ]
//    },
//    {
//        name: 'Osloby',
//        articles:[
//            {title: 'Oracle', image:'http://www.zpub.com/un/larryhotdog.jpg'}
//        ]
//    }
];

// section feed data to model
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
        article.url = $(entry).find("id").text();
        section.articles.push(article);
    });
    return section;
}

// article feed data to model
function createArticleModel(data) {
    var xml = $(data);
    var title = xml.find('title').text();
    var leadtext = xml.find("vdf\\:payload vdf\\:field[name='LEADTEXT'] vdf\\:value").text();
    var bodytext = xml.find("vdf\\:payload vdf\\:field[name='BODYTEXT'] vdf\\:value").text();
    return {'title': title, 'leadtext': leadtext, 'bodytext': bodytext};
}

function articleModelToDom(article) {
    var articleTemplate = $('.article.template');
    var articleView = articleTemplate.clonifyTemplate("#articlePreview");
    articleView.find(".title").text(article.title);
    articleView.find(".leadtext").text(article.leadtext);
    articleView.find(".bodytext").text(article.bodytext);
}

function sectionsModelToDom(sections) {
    var slides = $('.slides').detach();
    var articleTeaserTemplate = $('.articleTeaser.template').detach();
    var sectionTemplate = $('.section.template').detach();

    sections.forEach(function(section) {
        var sectionView = sectionTemplate.clonifyTemplate(slides);
        sectionView.find('.sectionName').text(section.name);

        section.articles.forEach(function(article) {
            var articleTeaserView = articleTeaserTemplate.clonifyTemplate(sectionView);
            articleTeaserView.find('.title').text(article.title);
            if(article.image) {
                articleTeaserView.find('.image').attr({src: article.image});
            } else {
                articleTeaserView.find('.image').remove();
            }
            articleTeaserView.click(function() {
                $("#articlePreview").text("Loading...");
                $.get(article.url).done(function(data) {
                    $("#articlePreview").text("");
                    articleModelToDom(createArticleModel(data));
                });
            });
        });
    });

    slides.appendTo('.reveal');
}

function contentLoaded() {
    $('.loadingIndicator').hide();
}

function initializeReveal() {
    Reveal.initialize({
        controls: true,
        progress: true,
        history: true,
        center: true,

        theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
        transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/none

        // Optional libraries used to extend on reveal.js
        dependencies: [
            { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
            { src: 'plugin/markdown/showdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
            { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
            { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
            { src: 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
            { src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
            // { src: 'plugin/remotes/remotes.js', async: true, condition: function() { return !!document.body.classList; } }
        ]
    });
}

//var section12Promise = $.get('http://apitestbeta3.medianorge.no/news/publication/ap/escenic/section/12/auto').done(function(data) {
//    sections.push(createSection('Section 12', data));
//});
//
//var section13Promise =  $.get('http://apitestbeta3.medianorge.no/news/publication/ap/escenic/section/13/auto').done(function(data) {
//    sections.push(createSection('Section 13', data));
//});
//
//var promises = [section12Promise, section13Promise];
//
//$.when.apply($, promises).done(function() {
//    modelToDom(sections);
//});

$.get(feeds[0].url).done(function(data) {
    sections.push(createSection(feeds[0].name, data));
    $.get(feeds[1].url).done(function(data) {
        sections.push(createSection(feeds[1].name, data));
        sectionsModelToDom(sections);
        contentLoaded();
        initializeReveal();
        $("section").attr("href", "#articlePreview");
        $("section").leanModal();
    });
});

//$.when($.get('http://apitestbeta3.medianorge.no/news/publication/common/escenic/section/229/auto'),
//       $.get('http://apitestbeta3.medianorge.no/news/publication/common/escenic/section/222/auto'))
//.done(function(result1, result2) {
//        sections.push(createSection('Football', result1));
//        sections.push(createSection('Snowboard', result2));
//        modelToDom(sections);
//});






