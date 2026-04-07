// 全局语言变量（默认中文）
let currentLang = 'zh';
const content_dir = 'contents/';
const config_file = 'config.yml';
const section_names = ['home', 'awards', 'experience', 'interests'];

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Yaml 配置加载（不动）
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }
            })
        })
        .catch(error => console.log(error));

    // 页面初始化加载默认语言（中文）
    loadMarkdownFiles(currentLang);
});

// ==============================================
// 🔥 核心双语切换函数：加载对应语言的 MD 文件
// ==============================================
function loadMarkdownFiles(lang = 'zh') {
    currentLang = lang;
    marked.use({ mangle: false, headerIds: false });
    
    section_names.forEach((name) => {
        // 英文加载 name_en.md，中文加载 name.md
        const fileName = lang === 'en' ? `${name}_en.md` : `${name}.md`;
        
        fetch(content_dir + fileName)
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            })
            .then(() => {
                MathJax.typeset();
            })
            .catch(error => console.log('MD文件加载失败：', error));
    });
}

// 暴露函数给全局，让切换按钮可以调用
window.loadMarkdownFiles = loadMarkdownFiles;