CREATE TABLE shop (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  hours TEXT NOT NULL
);

INSERT INTO shop (id, name, address, hours) VALUES (
  1,
  'Emerson Barber Shop',
  'Rua da Saboaria, 103 • Boa Vista de Sao Caetano, Salvador - BA',
  'Terça a sábado, das 9h às 20h'
);

CREATE TABLE services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  badge TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE barbers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  specialty TEXT NOT NULL,
  experience TEXT NOT NULL,
  shift_start TIME NOT NULL,
  shift_end TIME NOT NULL,
  CHECK (shift_end > shift_start)
);

CREATE TABLE appointments (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  barber_id TEXT NOT NULL REFERENCES barbers (id),
  service_id TEXT NOT NULL REFERENCES services (id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmado', 'pendente', 'concluido', 'cancelado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX appointments_active_slot_uidx
  ON appointments (barber_id, appointment_date, appointment_time)
  WHERE status <> 'cancelado';

INSERT INTO services (id, name, price, duration_minutes, badge, description, sort_order) VALUES
  ('classic-cut', 'Corte tradicional', 35, 40, 'Mais pedido', 'Laterais alinhadas, topo ajustado ao perfil do cliente e finalização limpa.', 1),
  ('fade-cut', 'Degradê na régua', 45, 50, 'Precisão', 'Transição marcada com acabamento técnico e desenho sob medida.', 2),
  ('beard-care', 'Barba completa', 28, 30, 'Express', 'Contorno, toalha quente e hidratação para manter o desenho firme.', 3),
  ('combo', 'Combo corte + barba', 60, 75, 'Custo-benefício', 'Pacote fechado para quem quer sair pronto sem perder tempo.', 4),
  ('eyebrow', 'Sobrancelha alinhada', 15, 15, 'Detalhe', 'Correção leve para manter expressão limpa e natural.', 5),
  ('hydration', 'Hidratação capilar', 25, 20, 'Cuidado', 'Tratamento rápido para recuperar brilho e reduzir ressecamento.', 6);

INSERT INTO barbers (id, name, initials, specialty, experience, shift_start, shift_end) VALUES
  ('igor', 'Igor Mendes', 'IM', 'Fade técnico e acabamento na navalha', '7 anos de bancada', '09:00', '18:00'),
  ('leo', 'Léo Santana', 'LS', 'Barba desenhada e visagismo masculino', '5 anos de atendimento', '10:00', '19:00'),
  ('caue', 'Cauê Brito', 'CB', 'Corte social, infantil e combo rápido', '4 anos em barbearia premium', '11:00', '20:00');
