/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-poll
 * Base block: columns
 * Selector: .target-rcmd-quickpoll
 * Source: https://www.rinvoq.com/atopic-dermatitis
 * Description: Quick poll with image left, poll question and buttons right.
 *   Left column has "Quick Poll" image. Right column has the poll question,
 *   answer buttons as a list, and result content (heading, description, CTA).
 * UE Model: columns (2), rows (1) - standard columns component with 2 columns
 * Generated: 2026-05-25
 */
export default function parse(element, { document }) {
  // The element is .target-rcmd-quickpoll
  // Structure: image container (left) + poll help guide (right)

  // Left column: Quick Poll image
  const leftContent = [];
  const pollImage = element.querySelector('.multistep-qPoll-image, .multistep-qPoll-image-container img');
  if (pollImage) {
    const img = document.createElement('img');
    img.src = pollImage.getAttribute('src') || '';
    img.alt = pollImage.getAttribute('alt') || 'Quick Poll';
    leftContent.push(img);
  }

  // Right column: Poll question, options, and result content
  const rightContent = [];

  // Poll question
  const questionP = element.querySelector('.multistep-qPoll-question p');
  if (questionP) {
    const h2 = document.createElement('h2');
    h2.textContent = questionP.textContent.trim();
    rightContent.push(h2);
  }

  // Poll options as a list
  const options = Array.from(element.querySelectorAll('.multistep-qPoll-option'));
  if (options.length > 0) {
    const ul = document.createElement('ul');
    options.forEach((opt) => {
      const li = document.createElement('li');
      li.textContent = opt.textContent.trim();
      ul.appendChild(li);
    });
    rightContent.push(ul);
  }

  // Result content (first unique result - used as follow-up CTA)
  const firstResult = element.querySelector('.multistep-qPoll-results');
  if (firstResult) {
    const resultH2 = firstResult.querySelector('h2');
    if (resultH2) {
      const h3 = document.createElement('h3');
      h3.textContent = resultH2.textContent.trim();
      rightContent.push(h3);
    }

    const resultP = firstResult.querySelector('p:not(:has(a))');
    if (resultP) {
      const p = document.createElement('p');
      p.textContent = resultP.textContent.trim();
      rightContent.push(p);
    }

    const resultCta = firstResult.querySelector('a');
    if (resultCta) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = resultCta.getAttribute('href') || '';
      a.textContent = resultCta.textContent.trim();
      p.appendChild(a);
      rightContent.push(p);
    }
  }

  // Build cells: 1 row with 2 columns
  const cells = [
    [leftContent, rightContent],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-poll', cells });
  element.replaceWith(block);
}
