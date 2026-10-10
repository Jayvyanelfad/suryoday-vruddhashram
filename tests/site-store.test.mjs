import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  defaultSiteContent,
  readSiteContent,
  writeSiteContent,
} from '../src/lib/site-store.js';

const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'suryoday-content-test-'));
const previousPath = process.env.SITE_CONTENT_PATH;
process.env.SITE_CONTENT_PATH = path.join(temporaryDirectory, 'persistent', 'site-content.json');

after(async () => {
  if (previousPath === undefined) delete process.env.SITE_CONTENT_PATH;
  else process.env.SITE_CONTENT_PATH = previousPath;
  await rm(temporaryDirectory, { recursive: true, force: true });
});

test('site content persists on disk and reads back for independent requests', async () => {
  const initial = await readSiteContent();
  assert.equal(initial.brand.name, defaultSiteContent.brand.name);

  const edited = structuredClone(initial);
  edited.brand.name = 'Published Suryoday';
  edited.contact.email = 'published@example.org';
  edited.gallery.push({
    id: 'new-gallery-item',
    title: 'Garden',
    description: 'A peaceful garden visit.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  });

  await writeSiteContent(edited);
  const independentRead = await readSiteContent();
  assert.equal(independentRead.brand.name, 'Published Suryoday');
  assert.equal(independentRead.contact.email, 'published@example.org');
  assert.equal(independentRead.gallery.length, initial.gallery.length + 1);
});

test('site content rejects malformed fields and unsafe image URLs', async () => {
  const current = await readSiteContent();
  const invalidEmail = structuredClone(current);
  invalidEmail.contact.email = 'not-an-email';
  await assert.rejects(writeSiteContent(invalidEmail), TypeError);

  const unsafeImage = structuredClone(current);
  unsafeImage.gallery[0].image = 'javascript:alert(1)';
  await assert.rejects(writeSiteContent(unsafeImage), TypeError);

  const persisted = await readSiteContent();
  assert.equal(persisted.brand.name, current.brand.name);
});
