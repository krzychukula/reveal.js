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


// Glue. Model -> DOM
sections.forEach(function(section) {
    var sectionView = $('.section').clonifyTemplate('.slides');
    sectionView.find('.sectionName').text(section.name);

    section.articles.forEach(function(article) {
        var articleView = $('.article.template').clonifyTemplate(sectionView);
        articleView.find('.title').text(article.title);
        articleView.find('.image').attr({src: article.image});
    });
});

