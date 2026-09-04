// @vitest-environment jsdom
import { useState } from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './dialog';

afterEach(cleanup);

function DialogHarness() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open dialog</button>
      <a href="/background">Background link</a>
      <Dialog open={open} onOpenChange={setOpen} title="Verification">
        <p>Evidence before authorization.</p>
      </Dialog>
    </>
  );
}

test('keeps keyboard focus inside an open dialog', async () => {
  const user = userEvent.setup();
  render(<DialogHarness />);

  await user.click(screen.getByRole('button', { name: 'Open dialog' }));
  const dialog = screen.getByRole('dialog', { name: 'Verification' });

  await user.tab();
  await user.tab();

  expect(dialog.contains(document.activeElement)).toBe(true);
});

test('renders the modal layer at the document root', async () => {
  const user = userEvent.setup();
  render(<DialogHarness />);

  await user.click(screen.getByRole('button', { name: 'Open dialog' }));
  const dialog = screen.getByRole('dialog', { name: 'Verification' });

  expect(dialog.parentElement?.parentElement).toBe(document.body);
});
