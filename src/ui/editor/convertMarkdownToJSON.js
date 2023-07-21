import MarkdownIt from 'markdown-it';

function convertMarkdownToJSON(md) {
  const markdown = new MarkdownIt();
  const tokens = markdown.parse(md, {});

  const json = tokens.reduce((acc, token, index) => {
    if (token.type === 'heading_open') {
      acc.push({
        type: 'heading',
        attrs: { level: parseInt(token.tag.slice(1)) },
        content: [{ type: 'text', text: tokens[index + 1].content }],
      });
    } else if (token.type === 'paragraph_open') {
      acc.push({
        type: 'paragraph',
        content: [{ type: 'text', text: tokens[index + 1].content }],
      });
    } else if (token.type === 'link_open') {
      acc.push({
        type: 'text',
        marks: [
          {
            type: 'link',
            attrs: {
              href: token.attrs[0][1],
              target: '_blank',
              class: 'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer',
            },
          },
        ],
        text: tokens[index + 1].content,
      });
    } else if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open') {
      const listItems = [];
      let i = index + 1;
      while (tokens[i].type !== 'bullet_list_close' && tokens[i].type !== 'ordered_list_close') {
        if (tokens[i].type === 'list_item_open') {
          listItems.push({
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: tokens[i + 1].content }],
              },
            ],
          });
        }
        i++;
      }
      acc.push({
        type: token.type === 'bullet_list_open' ? 'bulletList' : 'orderedList',
        attrs: { start: 1 },
        content: listItems,
      });
    }
    return acc;
  }, []);

  return {
    type: 'doc',
    content: json,
  };
}

export default convertMarkdownToJSON;
