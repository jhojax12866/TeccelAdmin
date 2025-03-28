"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";

type ContactFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <Card>
        <CardHeader>
          <CardTitle>Formulario de Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Déjanos tu mensaje y te responderemos pronto.</p>
          <form className="space-y-4 mt-4">
            <input
              type="text"
              placeholder="Nombre"
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
            />
            <textarea
              rows={4}
              placeholder="Mensaje"
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
            ></textarea>
            <Button type="submit" className="w-full bg-[#e41e26] hover:bg-[#c41a21]">
              Enviar Mensaje
            </Button>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
}
