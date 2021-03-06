// YOU CAN ADD EXTRA FEEDS HERE
var feeds = [
    { name: 'Sport', url: 'http://apitestbeta3.medianorge.no/news/publication/common/escenic/section/210/auto'},
    { name: 'Football', url: 'http://apitestbeta3.medianorge.no/news/publication/common/escenic/section/222/auto'}
]

// templating
jQuery.fn.clonifyTemplate = function(selector) {
    return this
        .filter('.template')
        .clone()
        .removeClass('template')
        .appendTo(selector);
};

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

// model
var sections = [
//    {
//        name: 'Forside',
//        articles:[
//            {title: 'Windows', image:'http://www.zpub.com/un/larryhotdog.jpg'},
//            {title: 'Office', image:'http://www.zpub.com/un/larryhotdog.jpg'},
//            {title: 'SQL Server', image:'http://www.zpub.com/un/larryhotdog.jpg'}
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
function createSectionModel(name, data) {
    var xml = $(data);
    var entries = xml.find('entry');

    var section = {};
    section.name = name;
    section.articles = [];
    entries.each(function(index, entry) {
        var article = {};
        console.log(entry);
        article.title = $(entry).find('title').text();
        if($(entry).find('link[rel="TEASERREL"]').attr("href")) {
            article.image = $(entry).find('link[rel="TEASERREL"]').attr("href").replace("{snd:cropversion}", "w180c43").replace("{snd:mode}", "ALTERNATES");
            article.url = $(entry).find("id").text();
            section.articles.push(article);
        }
    });
    return section;
}

// article feed data to model
function createArticleModel(data) {
    var xml = $(data);
    var title = xml.find('title').text();
    var leadtext = xml.find("vdf\\:payload vdf\\:field[name='leadtext'] vdf\\:value").text();
    var bodytext = xml.find("vdf\\:payload vdf\\:field[name='bodytext'] vdf\\:value div").html();
    return {'title': title, 'leadtext': leadtext, 'bodytext': bodytext};
}

function articleModelToDom(article) {
    var articleTemplate = $('.article.template');
    var articleView = articleTemplate.clonifyTemplate("#articlePreview");
    articleView.find(".title").text(article.title);
    articleView.find(".leadtext").text(article.leadtext);
    articleView.find(".bodytext").html(article.bodytext);
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

function setupArticleModal() {
    $("section").attr("href", "#articlePreview");
    $("section").leanModal({top: 10, closeButton: ".modal_close"});
    $("#articlePreview").focus();
}

var promises = feeds.map(function(feed) {
    return $.get(feed.url).done(function(data) {
        sections.push(createSectionModel(feed.name, data));
    });

});

$.when.apply($, promises).done(function() {
    sectionsModelToDom(sections);
    contentLoaded();
    initializeReveal();
    setupArticleModal();
});
