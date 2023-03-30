# Microservices Study

This repository is a collection of microservices built using various technologies, such as Docker, Kubernetes, NextJS, and more. The repository contains a client service, three different microservices, a shared library, and Kubernetes configurations.

## Project Structure

The repository is structured as follows:

- `auth`: Authentication service written in TypeScript with a MongoDB database.
- `client`: Client service (Next.js application) written in JavaScript.
- `common`: Shared library between the services (except for the client) written in TypeScript.
- `expiration`: Expiration service, a worker service written in TypeScript with a Redis database.
- `infra/k8s`: Kubernetes configuration files.
- `nats-test`: A small project (playground) built to test the nats-streaming-service. This project is unrelated to the repository.
- `orders`: CRUD service that holds orders of tickets, written in TypeScript with a MongoDB database.
- `payments`: Payments service that holds all charges and orders, written in TypeScript with a MongoDB database. Third-party Stripe is also used.
- `tickets`: Ticket service that holds all tickets with CRUD option, written in TypeScript with a MongoDB database.
- `skaffold.yaml`: Configuration file for starting the development environment.
