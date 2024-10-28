import React, { useState, useEffect, useRef } from 'react';

interface AddressAutocompleteProps {
    onAddressSelect: (address: string) => void;
}

export const AddressSelector: React.FC<AddressAutocompleteProps> = React.memo(
    ({ onAddressSelect }) => {
        const [address, setAddress] = useState<string>('');
        const [isApiLoaded, setIsApiLoaded] = useState(false);
        const autocompleteRef = useRef<HTMLInputElement | null>(null);
        const autocompleteInstance =
            useRef<google.maps.places.Autocomplete | null>(null);

        // Функция для динамической загрузки Google Maps API
        const loadGoogleMaps = (apiKey: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                if (document.getElementById('google-maps')) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.id = 'google-maps';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                script.onload = () => resolve();
                script.onerror = () =>
                    reject(new Error('Google Maps API failed to load.'));
                document.head.appendChild(script);
            });
        };

        useEffect(() => {
            loadGoogleMaps('api-key')
                .then(() => {
                    setIsApiLoaded(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        }, []);

        useEffect(() => {
            if (!isApiLoaded || !autocompleteRef.current) return;

            // Создаем экземпляр Autocomplete после загрузки API
            autocompleteInstance.current = new google.maps.places.Autocomplete(
                autocompleteRef.current,
                {
                    types: ['address'],
                    componentRestrictions: { country: 'ua' }, // Ограничьте страну, если нужно
                }
            );

            // Подписываемся на событие place_changed для получения выбранного адреса
            autocompleteInstance.current.addListener('place_changed', () => {
                const place = autocompleteInstance.current?.getPlace();
                if (place?.formatted_address) {
                    setAddress(place.formatted_address);
                    onAddressSelect(place.formatted_address);
                }
            });

            return () => {
                if (autocompleteInstance.current) {
                    google.maps.event.clearInstanceListeners(
                        autocompleteInstance.current
                    );
                }
            };
        }, [isApiLoaded, onAddressSelect]);

        return (
            <div>
                <label htmlFor="address" className="block text-sm font-medium">
                    Адреса доставки*:
                </label>
                <input
                    ref={autocompleteRef}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Введите адрес"
                    className="border rounded w-full p-2"
                />
            </div>
        );
    }
);
