-- Run this after schema.sql to seed initial data

INSERT INTO categories (name, description, icon) VALUES
  ('Cakes',    'Celebration & custom cakes for every occasion',      '🎂'),
  ('Cookies',  'Freshly baked cookies in a variety of flavors',      '🍪'),
  ('Pastries', 'Flaky, buttery pastries made fresh every morning',   '🥐'),
  ('Breads',   'Artisan sourdoughs and hearty loaves',               '🍞');

INSERT INTO items (category_id, name, description, price, is_available) VALUES
  (1, 'Classic Vanilla Birthday Cake', 'Light sponge with vanilla buttercream frosting, decorated with sprinkles', 38.00, 1),
  (1, 'Dark Chocolate Fudge Cake',     'Rich three-layer chocolate cake with ganache drizzle',                    42.00, 1),
  (1, 'Strawberry Shortcake',          'Fresh strawberries with whipped cream and a fluffy sponge base',          35.00, 1),
  (2, 'Chocolate Chip Cookies',        'Classic chewy cookies loaded with chocolate chips, baked to perfection',  12.00, 1),
  (2, 'Oatmeal Raisin Cookies',        'Hearty oatmeal cookies with plump raisins and a hint of cinnamon',        10.00, 1),
  (2, 'Snickerdoodle Cookies',         'Soft and pillowy cookies rolled in cinnamon-sugar',                       11.00, 1),
  (3, 'Butter Croissant',              'Classic French-style croissant with 27 layers of buttery flakiness',       4.50, 1),
  (3, 'Almond Danish',                 'Sweet pastry filled with almond cream and topped with flaked almonds',     5.00, 1),
  (3, 'Cinnamon Roll',                 'Pillowy soft roll with cinnamon filling and cream cheese glaze',           5.50, 1),
  (4, 'Country Sourdough',             'Tangy sourdough with a crispy crust and chewy open crumb',                9.00, 1),
  (4, 'Honey Whole Wheat',             'Wholesome loaf with a touch of honey and nutty whole wheat flavor',       8.00, 1),
  (4, 'Rosemary Focaccia',             'Italian-style flatbread with fresh rosemary, olive oil, and sea salt',    7.50, 1);

INSERT INTO offers (title, description, discount, is_active, valid_until) VALUES
  ('Weekend Special',  'Get 20% off on all cookies every weekend!',                                   '20% OFF',     1, '2026-12-31'),
  ('Birthday Bundle',  'Order any cake and get a free dozen cookies. Perfect for celebrations!',       'FREE COOKIES', 1, '2026-08-31');
